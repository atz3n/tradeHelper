/**
 * @description:
 * <Description>
 *
 * 
 * <Optional informations>
 *
 * 
 * @author Atzen
 * @version 1.0.0
 *
 * 
 * CHANGES:
 * 02-Jun-2015 : Initial version
 */


import { IExchange } from '../../apis/IExchange.js';
var KrakenClient = Meteor.npmRequire('kraken-api'); // npm import 


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

/***********************************************************************
  Public Static Variable
 ***********************************************************************/

ExKraken.ConfigDefault = {
  id: 'undefined',
  key: 'undefined',
  secret: 'undefined',
  pair: 'undefined',
  quoteAmountType: 'undefined', // value (total amount), percentage (relative to available amount)
  qAmount: 'undefined',
  hotMode: false,
  priceType: 'undefined', // 24Average (24 Average from kraken Api), tradesAvarage (self calculated avarage depend on trAvType)
  trAvType: 'undefined', // quantity (number of last trades), time (seconds in the past)
  trAvNum: 0,
  trAvSec: 0,
}


/***********************************************************************
  Private Static Function
 ***********************************************************************/

/***********************************************************************
  Public Static Function
 ***********************************************************************/

ExKraken.getTradePairInfos = function() {
  return Async.runSync(function(done) {

    new KrakenClient().api('AssetPairs', null, function(error, data) {
      if (error) {
        console.log(error);
        done(ExError.srvConError, null);
      } else {
        done(ExError.ok, data.result);
      }
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

  var _config = Object.assign({}, ExKraken.ConfigDefault);
  var _pairUnits = { base: 'none', quote: 'none' };
  var _price = 0;
  var _aPrice = 0;
  var _volume = 0;
  var _cropFactor = 6;

  var _kraken = {};


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  var _syncApiCall = function(method, params) {
    return Async.runSync(function(done) {
      _kraken.api(method, params, function(error, data) {
        if (error) {
          console.log(error);
          done(ExError.srvConError, null);
        } else {
          done(ExError.ok, data.result);
        }
      });
    });
  }

  var _calcVolume = function() {

    var sRet = _syncApiCall('Balance', null);
    if (sRet.error !== ExError.ok) return sRet;

    if (_config.quoteAmountType !== 'value' && _config.quoteAmountType !== 'percentage') {
      return errHandle(ExError.error, null);
    }

    var tmp = parseFloat(sRet.result[_pairUnits.quote]);
    if (isNaN(tmp)) return errHandle(ExError.parseError, null)

    var balance = tmp;
    var volume = 0;

    if (_config.quoteAmountType === 'value') {
      if (balance < _config.qAmount * 1.01) {
        return errHandle(ExError.toLessBalance, null);
      }

      return errHandle(ExError.ok, cropFracDigits(_config.qAmount / _price, _cropFactor));
    }


    if (_config.quoteAmountType === 'percentage') {
      if (balance < balance * (_config.qAmount / 100) * 1.01) {
        return errHandle(ExError.toLessBalance, null);
      }

      return errHandle(ExError.ok, cropFracDigits(balance * (_config.qAmount / 100) / _price, _cropFactor));
    }
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  this.update = function() {
    _config.priceType = '24Average';


    if (_config.priceType === '24Average') {

      var sRet = _syncApiCall('Ticker', { pair: _config.pair });
      if (sRet.error !== ExError.ok) return sRet;

      var tmp = parseFloat(sRet.result[_config.pair].p[1]);
      if (isNaN(tmp)) return errHandle(ExError.parseError, null);

      _price = tmp;

      return errHandle(ExError.ok, null);
    }


    if (_config.priceType === 'tradesAvarage') {
      var sRet = _syncApiCall('Trades', { pair: _config.pair });
      if (sRet.error !== ExError.ok) return sRet;


      if (_config.trAvType === 'time') {
        var trArray = sRet.result[_config.pair];

        var curSec = parseInt(String(trArray[trArray.length - 1][2]).split('.')[0]);
        if (isNaN(curSec)) return errHandle(ExError.parseError, null);

        var error = false;
        var tmp = trArray.slice(trArray.indexOf(trArray.find(function(trade) {
          var trSec = parseInt(String(trade[2]).split('.')[0]);
          if (isNaN(trSec)) { error = true;
            return true; }

          return trSec >= curSec - _config.trAvSec;
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

        var tmp = trArray.slice(-_config.trAvNum);


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
    var sRet = _syncApiCall('Trades', { pair: _config.pair });
    if (sRet.error !== ExError.ok) return sRet;

    var trArray = sRet.result[_config.pair];

    _config.trAvNum = 7;
    var tmp = trArray.slice(-_config.trAvNum);


    var meanArray = [];
    for (i in tmp) {
      meanArray[i] = parseFloat(tmp[i][0]);
      if (isNaN(meanArray[i])) return errHandle(ExError.parseError, null);
    }

    // _price = average(meanArray);

    console.log(trArray)
    console.log(tmp)

    console.log(average(meanArray))
      // console.log(trArray)
      // console.log(meanArray)
      // console.log(tmp)
      // console.log(trArray.indexOf(tmp))
      // console.log(curSec - _config.trAvSec)
      // console.log(curSec)

    // console.log(sRet.result.last)
    // console.log(trArray[trArray.length - 1])
    // var arr2 = trArray.slice(-5);
    // console.log(trArray.length)
    // console.log(arr2)


    // console.log(trArray[trArray.length - 1])
    // console.log(String(trArray[0][2]).length)
    // console.log(new Date(parseInt(String(trArray[0][2]).split('.')[0]) * 1000))



    return errHandle(ExError.ok, null);
  }


  this.getInfo = function() {
    return errHandle(ExError.ok, null);
  }


  this.getPairUnits = function() {
    return errHandle(ExError.ok, { base: _pairUnits.base.substring(1, 4), quote: _pairUnits.quote.substring(1, 4) });
  }


  this.getPrice = function() {
    return errHandle(ExError.ok, _price);
  }


  this.getActionPrice = function() {
    if (!_config.hotMode) {
      return errHandle(ExError.ok, _aPrice);
    }
    return errHandle(ExError.ok, 1);
  }


  this.buy = function(position) {
    if (position === 'long') {

      var tmp = _calcVolume();
      if (tmp.error !== ExError.ok) return tmp;


      if (!_config.hotMode) {
        _aPrice = _price;
        _volume = tmp.result;

      } else {
        tmp = Async.runSync(function(done) {
          var order = {
            // validate: true,
            trading_agreement: 'agree',
            pair: _config.pair,
            ordertype: 'market',
            volume: 0.05,
            type: 'buy'
          };

          _kraken.api('AddOrder', order, function(error, data) {
            if (error) {
              console.log(error);
              done(ExError.srvConError, null);
            } else {
              done(data.error, data.result);
            }
          });

        });
        console.log(tmp);
      }
      return errHandle(ExError.ok, null);


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


  this.sell = function(position) {
    if (position === 'short') {
      var tmp = _calcVolume();
      if (tmp.error !== ExError.ok) return tmp;


      if (!_config.hotMode) {
        _aPrice = _price;
        _volume = tmp.result;
      } else {

      }
      return errHandle(ExError.ok, null);


    } else if (position === 'long') {
      if (!_config.hotMode) {
        _volume = 0;
        _aPrice = _price;

        return errHandle(ExError.ok, null);
      } else {

        tmp = Async.runSync(function(done) {
          var order = {
            // validate: true,
            trading_agreement: 'agree',
            pair: _config.pair,
            ordertype: 'market',
            volume: 0.01,
            type: 'sell'
          };

          _kraken.api('AddOrder', order, function(error, data) {
            if (error) {
              console.log(error);
              done(ExError.srvConError, null);
            } else {
              done(data.error, data.result);
            }
          });

        });
        console.log(tmp);
        return errHandle(ExError.ok, null);
      }
    }

    /* wrong parameter */
    return errHandle(ExError.error, null);
  }


  this.getInstInfo = function() {
    return errHandle(ExError.ok, { id: _config.id, type: "ExKraken" });
  }


  this.getVolume = function() {
    if (!_config.hotMode) {
      return errHandle(ExError.ok, _volume);
    }
    return errHandle(ExError.ok, 1);
  }


  this.setQuoteAmount = function() {
    /* TODO return amount */
    return errHandle(ExError.notImpl, null);
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/

  // var _constructor = function() {
  // }

  // _constructor();
}
