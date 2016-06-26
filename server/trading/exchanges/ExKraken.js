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
  quoteAmountType: 'undefined',
  qAmount: 'undefined',
  hotMode: false
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

  var _calcVolume = function() {
    return Async.runSync(function(done) {

      _kraken.api('Balance', null, function(error, data) {
        if (error) {
          console.log(error);
          done(ExError.srvConError, null);
        } else {
          if (_config.quoteAmountType !== 'value' && _config.quoteAmountType !== 'percentage') {
            console.log('err1');
            return done(ExError.error, null);
          }

          var tmp = parseFloat(data.result[_pairUnits.quote]);
          if (isNaN(tmp)) return done(ExError.parseError, null)

          var balance = tmp;
          var volume = 0;

          if (_config.quoteAmountType === 'value') {
            if (balance < _config.qAmount * 1.01) {
              return done(ExError.toLessBalance, null);
            }

            return done(ExError.ok, cropFracDigits(_config.qAmount / _price, _cropFactor));

          } else if (_config.quoteAmountType === 'percentage') {
            if (balance < balance * (_config.qAmount / 100) * 1.01) {
              return done(ExError.toLessBalance, null);
            }

            return done(ExError.ok, cropFracDigits(balance * (_config.qAmount / 100) / _price, _cropFactor));
          }
        }
      });

    });
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  this.update = function() {
    return Async.runSync(function(done) {
      
      /* TODO add price calculation based on last trades  */

      _kraken.api('Ticker', { pair: _config.pair }, function(error, data) {
        if (error) {
          console.log(error);
          done(ExError.srvConError, null);
        } else {
          var tmp = parseFloat(data.result[_config.pair].p[1]);
          if (isNaN(tmp)) return done(ExError.parseError, null);

          _price = tmp;
          done(ExError.ok, null);
        }
      });

    });
  }


  this.setConfig = function(configuration) {

    _config = Object.assign({}, configuration);
    _kraken = new KrakenClient(_config.key, _config.secret);

    tmp = ExKraken.getTradePairInfos();

    if (tmp.error === ExError.ok) {
      var tmp2 = parseInt(tmp.result[_config.pair].lot_decimals);
      if (isNaN(tmp2)) return errHandle(ExError.parseError, null);

      _pairUnits.base = tmp.result[_config.pair].base;
      _pairUnits.quote = tmp.result[_config.pair].quote;
      _cropFactor = tmp2;

      return errHandle(ExError.ok, null);
    } else {
      return tmp;
    }
  }


  this.getConfig = function() {
    var tmp = Object.assign({}, _config);
    delete tmp.id;

    return errHandle(ExError.ok, tmp);
  }


  this.getStatus = function() {
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
            volume: 0.01,
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


    } else {
      /* wrong parameter */
      return errHandle(ExError.error, null);
    }
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


    } else {
      /* wrong parameter */
      return errHandle(ExError.error, null);
    }
  }


  this.getInstInfo = function() {
    return errHandle(ExError.ok, { id: _config.id, type: "ExKraken" });
  }


  this.getVolume = function() {
    if (!_config.hotMode) {
      return errHandle(ExError.ok, volume);
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
