/**
 * @description:
 * Class for interacting with kraken.com exchange
 *
 * 
 * This class implements the kraken.com api's and should be used to trade with this exchange
 *
 * 
 * @author Atzen
 * @version 0.1.0
 *
 * 
 * CHANGES:
 * 02-July-2016 : Initial version
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
  key: 'undefined',
  secret: 'undefined',
  pair: 'undefined',
  qAmountType: 'amount', // value (total amount), percentage (relative to available amount)
  qAmount: 0,
  hotMode: false,
  priceType: 'tradesAverage', // 24Average (24 Average from kraken Api), tradesAverage (self calculated avarage depend on trAvType)
  trAvType: 'time', // quantity (number of last trades), time (seconds in the past)
  trAvVal: 60,
  orderType: 'market', // market (buy/sell by market price), limit (buy/sell to given price)
  conErrorCycles: 3, // tries before an connection error will be returned
  conErrorWaitSec: 3, // time to wait until a connection will be established again (in seconds)
  orderCheckWaitSec: 10
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
  return Async.runSync(function(done) { // wraps asynchronous function call in synchronous call

    /* get asset pair informations from kraken.com */
    new KrakenClient().api('AssetPairs', null, function(error, data) {
      if (error) done(ExError.srvConError, error);
      else done(ExError.ok, data.result);
    });

  });
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
  var _aPrice = 0;

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
   * @return {Object}        obj.error: ExError error, obj.result: api data object or error message (in case of ExError != ExError.ok)
   */
  var _syncApiCall = function(method, params) {
    return Async.runSync(function(done) {
      _kraken.api(method, params, function(error, data) {
        if (error) return done(ExError.srvConError, error);
        else return done(ExError.ok, data.result);
      });
    });
  }


  var _calcVolume = function() {

    var sRet = _syncApiCall('Balance', null);
    if (sRet.error !== ExError.ok) return sRet;

    if (_config.qAmountType !== 'value' && _config.qAmountType !== 'percentage') {
      return errHandle(ExError.error, null);
    }

    var tmp = parseFloat(sRet.result[_pairUnits.quote]);
    if (isNaN(tmp)) return errHandle(ExError.parseError, null)

    var balance = tmp;
    var volume = 0;

    if (_config.qAmountType === 'value') {
      if (balance < _config.qAmount * 1.01) {
        return errHandle(ExError.toLessBalance, null);
      }

      return errHandle(ExError.ok, cropFracDigits(_config.qAmount / _price, _cropFactor));
    }


    if (_config.qAmountType === 'percentage') {
      if (balance < balance * (_config.qAmount / 100) * 1.01) {
        return errHandle(ExError.toLessBalance, null);
      }

      return errHandle(ExError.ok, cropFracDigits(balance * (_config.qAmount / 100) / _price, _cropFactor));
    }
  }


  var _setOrder = function(type, orderType, volume, price, valOnly) {
    if (!_config.hotMode) {
      _aPrice = price;
      _volume = volume;
      return errHandle(ExError.ok, null);

    } else {

      if (orderType !== 'market' && orderType !== 'limit')
        return errHandle(ExError.error, null);

      var order = {
        trading_agreement: 'agree',
        pair: _config.pair,
        volume: volume,
        type: type
      };

      if (valOnly) order.validate = true;

      if (orderType === 'market') {
        order.ordertype = 'market';
      }

      if (orderType === 'limit') {
        order.ordertype = 'limit';
        order.price = price;
      }

      var oRet = _syncApiCall('AddOrder', order);
      if (oRet.error !== ExError.ok) return oRet;

      if (!valOnly) _orderId = oRet.result.txid;
      return errHandle(ExError.ok, null);
    }

    return errHandle(ExError.error, null);
  }


  var _checkOrderFinished = function() {
    var sRet = _syncApiCall('ClosedOrders', { start: _orderId[0] });
    if (sRet.error !== ExError.ok) return sRet;

    if (Object.keys(sRet.result.closed).length === 0) {
      return errHandle(ExError.ok, false)
    }

    if (sRet.result.closed[_orderId]) {
      var order = sRet.result.closed[_orderId];

      _volume = order.vol_exec;
      _aPrice = order.price;

      return errHandle(ExError.ok, true)
    }

    return errHandle(ExError.ok, false);
  }


  var _cycFuncCallWrap = function(callback) {
    var ret = {};
    for (let i = 0; i < _config.conErrorCycles; i++) {
      ret = callback();

      if (ret.error !== ExError.srvConError) break;

      if (i < _config.conErrorCycles - 1) {
        Meteor._sleepForMs(_config.conErrorWaitSec * 1000);
      }
    }
    return ret;
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  this.update = function() {
    if (_config.priceType === '24Average') {

      var sRet = _syncApiCall('Ticker', { pair: _config.pair });
      if (sRet.error !== ExError.ok) return sRet;

      var tmp = parseFloat(sRet.result[_config.pair].p[1]);
      if (isNaN(tmp)) return errHandle(ExError.parseError, null);

      _price = tmp;

      return errHandle(ExError.ok, null);
    }


    if (_config.priceType === 'tradesAverage') {
      var sRet = _syncApiCall('Trades', { pair: _config.pair });
      if (sRet.error !== ExError.ok) return sRet;


      if (_config.trAvType === 'time') {
        var trArray = sRet.result[_config.pair];

        var curSec = parseInt(String(trArray[trArray.length - 1][2]).split('.')[0]);
        if (isNaN(curSec)) return errHandle(ExError.parseError, null);

        var error = false;
        var tmp = trArray.slice(trArray.indexOf(trArray.find(function(trade) {
          var trSec = parseInt(String(trade[2]).split('.')[0]);
          if (isNaN(trSec)) {
            error = true;
            return true;
          }

          return trSec >= curSec - _config.trAvVal;
        })));
        if (error) return errHandle(ExError.parseError, null);


        var meanArray = [];
        for (i in tmp) {
          meanArray[i] = parseFloat(tmp[i][0]);
          if (isNaN(meanArray[i])) return errHandle(ExError.parseError, null);
        }

        _price = average(meanArray);

        return errHandle(ExError.ok, null);
      }

      if (_config.trAvType === 'quantity') {
        var trArray = sRet.result[_config.pair];

        var tmp = trArray.slice(-_config.trAvVal);


        var meanArray = [];
        for (i in tmp) {
          meanArray[i] = parseFloat(tmp[i][0]);
          if (isNaN(meanArray[i])) return errHandle(ExError.parseError, null);
        }

        _price = average(meanArray);

        return errHandle(ExError.ok, null);
      }

      return errHandle(ExError.error, null);
    }

    return errHandle(ExError.error, null);
  }


  this.setConfig = function(configuration) {

    _config = Object.assign({}, configuration);
    _kraken = new KrakenClient(_config.key, _config.secret);

    tRet = ExKraken.getTradePairInfos();
    if (tRet.error !== ExError.ok) return tRet;

    var cF = parseInt(tRet.result[_config.pair].lot_decimals);
    if (isNaN(cF)) return errHandle(ExError.parseError, null);

    _pairUnits.base = tRet.result[_config.pair].base;
    _pairUnits.quote = tRet.result[_config.pair].quote;
    _cropFactor = cF;

    return errHandle(ExError.ok, null);
  }


  this.getConfig = function() {
    var tmp = Object.assign({}, _config);
    delete tmp.id;

    return errHandle(ExError.ok, tmp);
  }


  this.getStatus = function() {

    var cRet = _checkOrderFinished();
    console.log(cRet)
    if (cRet.error !== ExError.ok) return cRet;

    if (cRet.result) _boughtNotifyFunc(this.getInstInfo());

    return errHandle(ExError.ok, null);
  }


  this.getInfo = function() {
    return errHandle(ExError.notImpl, null);
  }


  this.getPairUnits = function() {
    return errHandle(ExError.ok, { base: _pairUnits.base.substring(1, 4), quote: _pairUnits.quote.substring(1, 4) });
  }


  this.getPrice = function() {
    return errHandle(ExError.ok, _price);
  }


  this.getActionPrice = function() {
    return errHandle(ExError.ok, _aPrice);
  }


  this.buy = async function(position) {
    if (position === 'long') {

      var cRet = _cycFuncCallWrap(function() {
        return _calcVolume();
      });
      if (cRet.error !== ExError.ok) {
        _boughtNotifyFunc(this.getInstInfo().result, cRet);
        return;
      }


      var oRet = _cycFuncCallWrap(function() {
        return _setOrder('buy', _config.orderType, cRet.result, _price, false);
      });
      if (oRet.error !== ExError.ok) {
        _boughtNotifyFunc(this.getInstInfo().result, oRet);
        return;
      }


      Meteor._sleepForMs(_config.orderCheckWaitSec * 1000);


      while (true) {
        var coRet = _cycFuncCallWrap(function() {
          return _checkOrderFinished();
        });
        if (coRet.error !== ExError.ok) {
          _boughtNotifyFunc(this.getInstInfo().result, coRet);
          return;
        }
        if (coRet.result) {
          _boughtNotifyFunc(this.getInstInfo().result, coRet);
          return;
        }

        Meteor._sleepForMs(_config.orderCheckWaitSec * 1000);
      }


    } else if (position === 'short') {
      if (!_config.hotMode) {
        _volume = 0;
        _aPrice = _price;

        return errHandle(ExError.ok, null);
      } else {

        /* TODO implement buy mechanism */
        return errHandle(ExError.notImpl, null);
      }
    }

    /* wrong parameter */
    return errHandle(ExError.error, null);
  }


  this.sell = async function(position) {
    if (position === 'long') {

      var oRet = _cycFuncCallWrap(function() {
        return _setOrder('sell', _config.orderType, _volume, _price, false);
      });
      if (oRet.error !== ExError.ok) {
        _soldNotifyFunc(this.getInstInfo().result, oRet);
        return;
      }


      Meteor._sleepForMs(_config.orderCheckWaitSec * 1000);


      while (true) {
        var coRet = _cycFuncCallWrap(function() {
          return _checkOrderFinished();
        });
        if (coRet.error !== ExError.ok) {
          _soldNotifyFunc(this.getInstInfo().result, coRet);
          return;
        }
        if (coRet.result) {
          _soldNotifyFunc(this.getInstInfo().result, coRet);
          return;
        }

        Meteor._sleepForMs(_config.orderCheckWaitSec * 1000);
      }



    } else if (position === 'short') {
      if (!_config.hotMode) {
        _volume = 0;
        _aPrice = _price;

        return errHandle(ExError.ok, null);
      } else {

        /* TODO implement sell mechanism */
        return errHandle(ExError.notImpl, null);
      }
    }

    /* wrong parameter */
    return errHandle(ExError.error, null);
  }


  this.setBoughtNotifyFunc = function(boughtNotifyFunction) {
    _boughtNotifyFunc = boughtNotifyFunction;
  }


  this.setSoldNotifyFunc = function(soldNotifyFunction) {
    _soldNotifyFunc = soldNotifyFunction;
  }


  this.getInstInfo = function() {
    return errHandle(ExError.ok, { id: _config.id, type: "ExKraken" });
  }


  this.getVolume = function() {
    return errHandle(ExError.ok, _volume);
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/

  // var _constructor = function() {
  // }

  // _constructor();
}
