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
var Future = Meteor.npmRequire('fibers/future');


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

// var _krakenClient = Meteor.npmRequire('kraken-api');


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

// ExKraken.ERROR_STRING = 'KrakenError';
// ExKraken.Pair = KrakenApi.Pair;

ExKraken.ConfigDefault = {
  key: 'undefined',
  secret: 'undefined',
  pair: 'undefined',
  quoteAmountType: 'undefined',
  qAmount: 'undefined',
  hotMode: false
}


/***********************************************************************
  Private Static Function
 ***********************************************************************/

// var _variable = function(param){
//   return 'Value';
// }


/***********************************************************************
  Public Static Function
 ***********************************************************************/

ExKraken.getTradePairInfos = function() {
  return Async.runSync(function(done) {

    new KrakenClient().api('AssetPairs', {}, function(error, data) {
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

  // this.Variable = 'Value'; 


  /***********************************************************************
    Private Instance Function
   ***********************************************************************/


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  this.update = function() {
    return Async.runSync(function(done) {

      _kraken.api('Ticker', { "pair": _config.pair }, function(error, data) {
        if (error) {
          console.log(error);
          done(ExError.srvConError, null);
        } else {
          _price = data.result[_config.pair].p[1];
          done(ExError.ok, null);
        }
      });

    });
  }


  this.setConfig = function(configuration) {
    return Async.runSync(function(done) {

      _config = Object.assign({}, configuration);
      _kraken = new KrakenClient(_config.key, _config.secret);

      tmp = ExKraken.getTradePairInfos();

      if (tmp.error !== ExError.srvConError) {
        _pairUnits.base = tmp.result[_config.pair].base;
        _pairUnits.quote = tmp.result[_config.pair].quote;
        done(ExError.ok, null);
      } else {
        done(tmp.error, null);
      }

    });
  }





  this.getConfig = function() {
    var tmp = Object.assign({}, _config);
    delete tmp.id;
    return tmp;
  }


  this.getStatus = function() {
    var future = new Future(); // to make async callback synchronous

    _kraken.api('TradesHistory', null, function(error, data) {
      if (error) {
        console.log(error);
        future.return('error');
      } else {
        console.log('called');
        future.return('bls');
        return future.wait();
        // future.return(data.result);
        console.log(data.result.trades)
          // console.log(data)
      }
    });

    return future.wait();
  }


  this.getInfo = function() {
    return '';
  }


  this.getPairUnits = function() {
    return { base: _pairUnits.base.substring(1, 4), quote: _pairUnits.quote.substring(1, 4) };
  }


  this.getPrice = function() {
    return _price;
  }

  this.getActionPrice = function() {
    if (!_config.hotMode) {
      return _aPrice;
    }
    return 1;
  }

  this.buy = function() {
    return Async.runSync(function(done) {

      _kraken.api('Balance', null, function(error, data) {
        if (error) {
          console.log(error);
          done(ExError.srvConError, null);
        } else {
          if (_config.quoteAmountType !== 'value' && _config.quoteAmountType !== 'percentage') {
            return done(ExError.error, null);
          }

          var balance = data.result[_pairUnits.quote];
          var volume = 0;
          var error = false;

          if (_config.quoteAmountType === 'value') {
            if (balance < _config.qAmount * 1.01) {
              return done(ExError.toLessBalance, null);
            }

            volume = cropFracDigits(_config.qAmount / _price, _cropFactor);


          } else if (_config.quoteAmountType === 'percentage') {
            if (balance < balance * (_config.qAmount / 100) * 1.01) {
              return done(ExError.toLessBalance, null);
            }

            volume = cropFracDigits(balance * (_config.qAmount / 100) / _price, _cropFactor);
          }

          if (!_config.hotMode) {
            _aPrice = _price;
            _volume = volume;
          }
          console.log('price: ' + _price);
          console.log('volume: ' + _volume);
          console.log('cost: ' + _price * _volume);
          done(ExError.ok, null);
        }
      });

    });
  }

  this.sell = function() {
    /* TODO: implementing sell mechanism */
    return true;

  }



  this.getInstInfo = function() {
    return {
      id: _config.id,
      type: "ExKraken"
    }
  }

  this.getVolume = function() {
    if (!_config.hotMode) {
      return _volume;
    }
    return 1;
  }

  this.setAmount = function() {
    /* TODO return amount */
    return 0;
  }


  // this.getAvailableAmount = function() {
  //   var future = new Future(); // to make async callback synchronous

  // _kraken.api('Balance', null, function(error, data) {
  //   if (error) {
  //     console.log(error);
  //     future.return('error');
  //   } else {
  //     future.return();
  //     // future.return(data.result);
  //     console.log(data.result)
  //     // console.log(data)
  //   }
  // });

  // return future.wait();
  // }


  /***********************************************************************
    Constructor
   ***********************************************************************/

  var _constructor = function() {

  }

  _constructor();
}
