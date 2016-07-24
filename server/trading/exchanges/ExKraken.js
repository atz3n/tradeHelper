/**
 * @description:
 * Class for interacting with kraken.com exchange
 *
 * 
 * This class implements the kraken.com api's and should be used to trade with this exchange
 *
 * 
 * @author Atzen
 * @version 0.3.4
 *
 * 
 * CHANGES:
 * 02-July-2016 : Initial version
 * 09-July-2016 : added getPositions function
 * 12-July-2016 : changed !hotMode + ownBalance combination to work without secret and api keys
 * 12-July-2016 : bugfixed buy and sell mechanism
 * 22-July-2016 : adapted to IExchange v1.1
 * 22-July-2016 : adapted to IExchange v1.3
 * 24-July-2016 : fixed bug in default config and getConfig() function
 */

/***********************************************************************
  TODO: 
 ***********************************************************************/
// - implementing partial order cancel handle
// - implementing short mechanism


import { IExchange } from '../../apis/IExchange.js';
var KrakenClient = Meteor.npmRequire('kraken-api'); // npm import 


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

/***********************************************************************
  Public Static Variable
 ***********************************************************************/

/**
 * Configuration structure
 * @type {Object}
 */
ExKraken.ConfigDefault = {
  id: 'undefined',
  name: 'undefined',

  pair: 'undefined',

  key: 'undefined',
  secret: 'undefined',

  balanceType: 'ownBalance', // krakenBalance (using kraken.com available balance for trading), ownBalance (using oBalanceAmount for trading)
  oBalanceAmount: 0,

  qAmountType: 'value', // value (total amount), percentage (relative to available amount)
  qAmount: 0,

  hotMode: false, // enable / disable real trading

  priceType: 'tradesAverage', // 24Average (24 Average from kraken Api), tradesAverage (self calculated average depending on trAvType)
  trAvType: 'time', // quantity (number of last trades), time (seconds in the past)
  trAvVal: 60,

  orderType: 'market', // market (buy/sell by market price), limit (buy/sell to given price)

  conErrorCycles: 3, // tries before an connection error will be returned
  conErrorWaitSec: 3, // time to wait until a connection will be established again (in seconds)

  orderCheckWaitSec: 10 // cycle time for order closed check
}


/***********************************************************************
  Private Static Function
 ***********************************************************************/

/***********************************************************************
  Public Static Function
 ***********************************************************************/

/**
 * Interface function (see IExchange.js for detail informations)
 */
ExKraken.getTradePairInfos = function() {

  var ret = {};
  for (var i = 0; i < 3; i++) {
    ret = Async.runSync(function(done) { // wraps asynchronous function call in synchronous call

      /* get asset pair informations from kraken.com */
      new KrakenClient().api('AssetPairs', null, function(error, data) {
        if (error) done(ExError.srvConError, error);
        else done(ExError.ok, data.result);
      });

    });

    if (ret.error !== ExError.srvConError) break;

    if (i < 2) {
      Meteor._sleepForMs(3 * 1000);
    }
  }

  return ret;
}


/***********************************************************************
  Class
 ***********************************************************************/

export function ExKraken(ConstrParam) {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  IExchange.apply(this);


  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  /**
   * Internal configuration object
   * @type {Object}
   */
  var _config = Object.assign({}, ExKraken.ConfigDefault);

  /**
   * Security pair units
   * @type {Object}
   */
  var _pairUnits = { base: 'none', quote: 'none' };

  /**
   * Calculated actual average price
   * @type {Number}
   */
  var _price = 0;

  /**
   * Real bought/sold price
   * @type {Number}
   */
  var _tPrice = 0;

  /**
   * Traded volume of base security
   * @type {Number}
   */
  var _volume = 0;

  /**
   * Determines the decimal places of a calculated volume
   * @type {Number}
   */
  var _cropFactor = 6;

  /**
   * Holds the placed order id
   * @type {String}
   */
  var _orderId = '';

  /**
   * used trading balance if _config.balanceType = 'oBalance'
   * @type {Number}
   */
  var _oBalance = 0;

  /**
   * Indicates that an open order exists
   * @type {Boolean}
   */
  var _orderOpen = false;

  /**
   * Kraken api class instance
   * @type {Object}
   */
  var _kraken = {};

  /**
   * Bought notification callback function
   * @type {Function}
   */
  var _boughtNotifyFunc = function() {};

  /**
   * Sold notification callback function
   * @type {Function}
   */
  var _soldNotifyFunc = function() {}; // sold notification function


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /**
   * Kraken api call wrapper to achieve synchronous api calls
   * @param  {String} method kraken api's method parameter
   * @param  {Object} params krakn api's params object
   * @return {Object} obj.error: ExError, obj.result: api data object or error message
   */
  var _syncApiCall = function(method, params) {
    return Async.runSync(function(done) { // wraps asynchronous function call in synchronous call

      /* call kraken.com api */
      _kraken.api(method, params, function(error, data) {
        if (error) return done(ExError.srvConError, error);
        else return done(ExError.ok, data.result);
      });

    });
  }


  /**
   * Calculates the base volume to buy
   * @return {Object} obj.error: ExError, obj.result: calculated volume or error message
   */
  var _calcVolume = function() {

    if (_config.hotMode) {

      /* get available balance from kraken.com */
      var sRet = _syncApiCall('Balance', null);
      if (sRet.error !== ExError.ok) return sRet;


      /* check returned quote balance */
      var balance = parseFloat(sRet.result[_pairUnits.quote]);
      if (isNaN(balance)) return errHandle(ExError.parseError, null)


      /* set balance to _oBalance if ownBalance is configured */
      if (_config.balanceType === 'ownBalance') {
        if (balance < _oBalance) return errHandle(ExError.toLessBalance, null);
        balance = _oBalance;
      }

    } else {

      /* set balance to _oBalance */
      balance = _oBalance;
    }


    /* calculate volume based on value amount type */
    if (_config.qAmountType === 'value') {
      if (balance < _config.qAmount * 1.01) return errHandle(ExError.toLessBalance, null); // check amount against balance (with a tolerance of 1 % for fees)
      return errHandle(ExError.ok, cropFracDigits(_config.qAmount / _price, _cropFactor)); // return volume
    }

    /* calculate volume based on percentage amount type */
    if (_config.qAmountType === 'percentage') {
      if (balance < balance * (_config.qAmount / 100) * 1.01) return errHandle(ExError.toLessBalance, null); // check amount against balance (with a tolerance of 1 % for fees)
      return errHandle(ExError.ok, cropFracDigits(balance * (_config.qAmount / 100) / _price, _cropFactor)); // return volume
    }
  }


  /**
   * Places an order 
   * @param {String} type      trade type ['buy' / 'sell']
   * @param {String} orderType order type ['market' / 'limit']
   * @param {Number} volume    volume to trade 
   * @param {Number} price     price limit (only used if orderType = 'limit')
   * @param {Bool} valOnly     true if only api call should be validated (no real order will be placed) 
   * @return {Object} obj.error: ExError, obj.result: null or error message
   */
  var _setOrder = function(type, orderType, volume, price, valOnly) {

    /* create order */
    var order = {
      trading_agreement: 'agree',
      pair: _config.pair,
      volume: volume,
      type: type
    };

    if (valOnly) {
      order.validate = true;
    }

    if (orderType === 'market') {
      order.ordertype = 'market';
    }

    if (orderType === 'limit') {
      order.ordertype = 'limit';
      order.price = price;
    }


    /* call kraken order api */
    var oRet = _syncApiCall('AddOrder', order);
    if (oRet.error !== ExError.ok) return oRet;


    /* save orderId */
    if (!valOnly) _orderId = oRet.result.txid;
    else console.log(oRet);


    return errHandle(ExError.ok, null);
  }


  /**
   * Checks if order is closed
   * @return {Object} obj.error: ExError, obj.result: true if closed / false if not, or error message
   */
  var _checkOrderClosed = function() {

    /* call kraken.com closed order api with saved order id */
    var sRet = _syncApiCall('ClosedOrders', { start: _orderId[0] });
    if (sRet.error !== ExError.ok) return sRet;


    /* check if any order is closed */
    if (Object.keys(sRet.result.closed).length === 0) {
      return errHandle(ExError.ok, false)
    }

    /* check if opened order is closed */
    if (sRet.result.closed[_orderId]) {
      var order = sRet.result.closed[_orderId];

      _volume = order.vol_exec; // set volume to executed volume
      _tPrice = order.price;

      return errHandle(ExError.ok, true)
    }

    /* return false if order is still open */
    return errHandle(ExError.ok, false);
  }


  /**
   * Wraps a function into a callback to call it _config.conErrorCycles times.
   * This is for function including kraken api calls. callback must return ExError errHanlde object ({error: <ExError>, result: <result>}) 
   * @param  {Function} callback callback that wraps a function
   * @return {Object} ExError errHanlde object
   */
  var _cycFuncCall = function(callback) {
    var ret = {};
    for (var i = 0; i < _config.conErrorCycles; i++) {
      ret = callback();

      if (ret.error !== ExError.srvConError) break;

      if (i < _config.conErrorCycles - 1) {
        Meteor._sleepForMs(_config.conErrorWaitSec * 1000);
      }
    }
    return ret;
  }


  /**
   * Checks configuration
   * @return {bool} false if error occurs
   */
  var _checkConfig = function() {
    if (_config.id === 'undefined') return false;
    if (_config.name === 'undefined') return false;

    if (_config.pair === 'undefined') return false;

    if (_config.balanceType !== 'krakenBalance' && _config.balanceType !== 'ownBalance') return false;
    if (isNaN(_config.oBalanceAmount)) return false;

    if (_config.qAmountType !== 'value' && _config.qAmountType !== 'percentage') return false;
    if (isNaN(_config.qAmount)) return false;

    if (typeof _config.hotMode !== 'boolean') return false;

    if (_config.hotMode) {
      if (_config.key === 'undefined') return false;
      if (_config.secret === 'undefined') return false;
    } else {
      if (_config.balanceType !== 'ownBalance') return false;
    }

    if (_config.priceType !== 'tradesAverage' && _config.priceType !== '24Average') return false;
    if (_config.trAvType !== 'time' && _config.trAvType !== 'quantity') return false;
    if (isNaN(_config.trAvVal)) return false;

    if (_config.orderType !== 'market' && _config.orderType !== 'limit') return false;

    if (isNaN(_config.conErrorCycles)) return false;
    if (isNaN(_config.conErrorWaitSec)) return false;

    if (isNaN(_config.orderCheckWaitSec)) return false;

    return true;
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.update = function() {

    /* get 24 average price from kraken.com */
    if (_config.priceType === '24Average') {

      /* call kraken.com ticker api */
      var sRet = _cycFuncCall(function() {
        return _syncApiCall('Ticker', { pair: _config.pair });
      });
      if (sRet.error !== ExError.ok) return sRet;

      /* check returned average price */
      var tmp = parseFloat(sRet.result[_config.pair].p[1]);
      if (isNaN(tmp)) return errHandle(ExError.parseError, null);

      /* set price */
      _price = tmp;

      return errHandle(ExError.ok, null);
    }


    /* calculate average price depending on recent trades */
    if (_config.priceType === 'tradesAverage') {

      /* get recent trades from kraken.com */
      var sRet = _cycFuncCall(function() {
        return _syncApiCall('Trades', { pair: _config.pair });
      });
      if (sRet.error !== ExError.ok) return sRet;
      var trArray = sRet.result[_config.pair];


      /* calculate average price depending on time */
      if (_config.trAvType === 'time') {

        /* get time of last trade (in unix timestamp) */
        var lastSec = parseInt(String(trArray[trArray.length - 1][2]).split('.')[0]);
        if (isNaN(lastSec)) return errHandle(ExError.parseError, null);


        /* get trades not longer than _config.trAvVal seconds in the past based on last trade */
        var error = false;
        var tmp = trArray.slice(trArray.indexOf(trArray.find(function(trade) {
          var trSec = parseInt(String(trade[2]).split('.')[0]);
          if (isNaN(trSec)) {
            error = true;
            return true;
          }

          return trSec >= lastSec - _config.trAvVal;
        })));
        if (error) return errHandle(ExError.parseError, null);


        /* create an array containing the trade prices */
        var priceArray = [];
        for (i in tmp) {
          priceArray[i] = parseFloat(tmp[i][0]);
          if (isNaN(priceArray[i])) return errHandle(ExError.parseError, null);
        }


        /* calculate average price */
        _price = average(priceArray);

        return errHandle(ExError.ok, null);
      }


      /* calculate average price depending on number of past trades based on last trade */
      if (_config.trAvType === 'quantity') {

        /* get last trades */
        var tmp = trArray.slice(-_config.trAvVal);


        /* create an array containing the trade prices */
        var priceArray = [];
        for (i in tmp) {
          priceArray[i] = parseFloat(tmp[i][0]);
          if (isNaN(priceArray[i])) return errHandle(ExError.parseError, null);
        }


        /* calculate average price */
        _price = average(priceArray);

        return errHandle(ExError.ok, null);
      }

      /* wrong trAvType */
      return errHandle(ExError.error, null);
    }

    /* wrong priceType */
    return errHandle(ExError.error, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.setConfig = function(configuration) {

    /* set internal configuration object */
    _config = mergeObjects(_config, configuration);


    /* check config elements */
    if (!_checkConfig()) return errHandle(ExError.error, null);


    /* set balance */
    if (_config.oBalance !== 'kBalance') _oBalance = _config.oBalanceAmount;


    /* instantiate kraken api class */
    _kraken = new KrakenClient(_config.key, _config.secret);


    /* set trade pair settings */
    tRet = ExKraken.getTradePairInfos();
    if (tRet.error !== ExError.ok) return tRet;

    var cF = parseInt(tRet.result[_config.pair].lot_decimals);
    if (isNaN(cF)) return errHandle(ExError.parseError, null);

    _pairUnits.base = tRet.result[_config.pair].base;
    _pairUnits.quote = tRet.result[_config.pair].quote;
    _cropFactor = cF;

    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getConfig = function() {
    var tmpA = [];


    tmpA.push({ title: 'Trade Pair', value: _config.pair });


    tmpA.push({ title: 'Balance Type', value: _config.balanceType });

    if (_config.balanceType === 'ownBalance') {
      tmpA.push({ title: 'Own Start Balance', value: _config.oBalanceAmount });
    }


    tmpA.push({ title: 'Balance Amount Type', value: _config.qAmountType });

    if (_config.qAmountType === 'percentage') {
      tmpA.push({ title: 'Amount from Balance [%]', value: _config.qAmount });
    }

    if (_config.qAmountType === 'value') {
      tmpA.push({ title: 'Amount from Balance [' + this.getPairUnits().result.quote + ']', value: _config.qAmount });
    }


    tmpA.push({ title: 'Hot Mode', value: JSON.stringify(_config.hotMode) });


    tmpA.push({ title: 'Price Type', value: _config.priceType });

    if (_config.priceType === 'tradesAverage') {
      tmpA.push({ title: 'Self Average Type', value: _config.trAvType });

      if (_config.trAvType === 'time') {
        tmpA.push({ title: 'Seconds in past', value: _config.trAvVal });
      }

      if (_config.trAvType === 'quantity') {
        tmpA.push({ title: 'Trades in past', value: _config.trAvVal });
      }
    }


    tmpA.push({ title: 'Order Type', value: _config.orderType });


    tmpA.push({ title: 'Connect to Server tries', value: _config.conErrorCycles });
    tmpA.push({ title: 'Delay seconds before next try', value: _config.conErrorWaitSec });
    tmpA.push({ title: ' Delay seconds before trade finished check ', value: _config.orderCheckWaitSec });


    return errHandle(ExError.ok, tmpA);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getInfo = function() {
    return errHandle(ExError.ok, [{ title: 'Own Balance', value: _oBalance }]);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getPairUnits = function() {
    return errHandle(ExError.ok, { base: _pairUnits.base.substring(1, 4), quote: _pairUnits.quote.substring(1, 4) });
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getPrice = function() {
    return errHandle(ExError.ok, _price);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getTradePrice = function() {
    return errHandle(ExError.ok, _tPrice);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.buy = async function(position) {

    /* long position */
    if (position === 'none') {

      /* calculate volume */
      var cRet = _cycFuncCall(function() {
        return _calcVolume();
      });

      if (cRet.error !== ExError.ok) {
        return _boughtNotifyFunc(this.getInstInfo().result, cRet);
      }


      /* if hot mode is disabled simulate a trade */
      if (!_config.hotMode) {
        _tPrice = _price;
        _volume = cRet.result;
        _oBalance -= _tPrice * _volume;

        return _boughtNotifyFunc(this.getInstInfo().result, errHandle(ExError.ok, true));
      }

      console.log('')

      /* set order */
      var oRet = _cycFuncCall(function() {
        return _setOrder('buy', _config.orderType, cRet.result, _price, false);
      });

      if (oRet.error !== ExError.ok) {
        return _boughtNotifyFunc(this.getInstInfo().result, oRet);
      }

      _orderOpen = true;


      /* check every _config.orderCheckWaitSec seconds if order is closed */
      while (true) {
        Meteor._sleepForMs(_config.orderCheckWaitSec * 1000);

        var coRet = _cycFuncCall(function() {
          return _checkOrderClosed();
        });

        if (coRet.error !== ExError.ok) {
          return _boughtNotifyFunc(this.getInstInfo().result, coRet);
        }

        if (coRet.result) {
          _orderOpen = false;
          _oBalance -= _tPrice * _volume;

          return _boughtNotifyFunc(this.getInstInfo().result, coRet);
        }
      }


      /* short position */
    } else if (position === 'short') {
      if (!_config.hotMode) {
        _tPrice = _price;
        _oBalance += _volume * _tPrice;

        return _boughtNotifyFunc(this.getInstInfo().result, true);
      } else {

        /* TODO implement buy mechanism */
        return _boughtNotifyFunc(this.getInstInfo().result, errHandle(ExError.notImpl, null));
      }
    }


    /* wrong parameter */
    _boughtNotifyFunc(this.getInstInfo().result, errHandle(ExError.error, null));
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.sell = async function(position) {

    /* long position */
    if (position === 'long') {

      /* if hot mode is disabled simulate a trade */
      if (!_config.hotMode) {
        _tPrice = _price;
        _oBalance += _tPrice * _volume;

        return _soldNotifyFunc(this.getInstInfo().result, errHandle(ExError.ok, true));
      }


      /* set order (volume = _volume) */
      var oRet = _cycFuncCall(function() {
        return _setOrder('sell', _config.orderType, _volume, _price, false);
      });

      if (oRet.error !== ExError.ok) {
        return _soldNotifyFunc(this.getInstInfo().result, oRet);
      }

      _orderOpen = true;


      /* check every _config.orderCheckWaitSec seconds if order is closed */
      while (true) {
        Meteor._sleepForMs(_config.orderCheckWaitSec * 1000);

        var coRet = _cycFuncCall(function() {
          return _checkOrderClosed();
        });

        if (coRet.error !== ExError.ok) {
          return _soldNotifyFunc(this.getInstInfo().result, coRet);
        }

        if (coRet.result) {
          _orderOpen = false;
          _oBalance += _tPrice * _volume;

          return _soldNotifyFunc(this.getInstInfo().result, coRet);
        }
      }


      /* short position */
    } else if (position === 'none') {

      /* calculate volume */
      var cRet = _cycFuncCall(function() {
        return _calcVolume();
      });

      if (cRet.error !== ExError.ok) {
        return _soldNotifyFunc(this.getInstInfo().result, cRet);
      }


      if (!_config.hotMode) {
        _tPrice = _price;
        _volume = cRet.result;
        _oBalance += _volume * _tPrice;

        return _soldNotifyFunc(this.getInstInfo().result, true);
      } else {

        /* TODO implement sell mechanism */
        return _soldNotifyFunc(this.getInstInfo().result, errHandle(ExError.notImpl, null));
      }
    }


    /* wrong parameter */
    _soldNotifyFunc(this.getInstInfo().result, errHandle(ExError.error, null));
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.stopTrade = function() {
    if (_orderOpen) {
      var cRet = _cycFuncCall(function() {
        return _syncApiCall('CancelOrder', { txid: _orderId[0] });
      });

      if (cRet !== ExError.ok) return cRet;

      return errHandle(ExError.ok, null);
    }

    return errHandle(ExError.error, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.setBoughtNotifyFunc = function(boughtNotifyFunction) {
    _boughtNotifyFunc = boughtNotifyFunction;
    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.setSoldNotifyFunc = function(soldNotifyFunction) {
    _soldNotifyFunc = soldNotifyFunction;
    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getInstInfo = function() {
    return errHandle(ExError.ok, { id: _config.id, name: _config.name, type: "ExKraken" });
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getVolume = function() {
    return errHandle(ExError.ok, _volume);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getPositions = function() {
    return errHandle(ExError.ok, { long: true, short: false });
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/
}
