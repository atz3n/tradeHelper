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
  amountType: 'undefined',
  tAmount: 'undefined',
  pAmount: 'undefined'
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
  var future = new Future(); // to make async callback synchronous

  new KrakenClient().api('AssetPairs', {}, function(error, data) {
    if (error) {
      console.log(error);
      future.return('error');
    } else {
      future.return(data.result);
    }
  });

  return future.wait();
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
    var state = false;
    var future = new Future(); // to make async callback synchronous

    _kraken.api('Ticker', { "pair": _config.pair }, function(error, data) {
      if (error) {
        console.log(error);
        future.return();
      } else {
        _price = data.result[_config.pair].p[1];
        state = true;
        future.return();
      }
    });

    future.wait();
    return state;
  }


  this.setConfig = function(configuration) {
    _config = Object.assign({}, configuration);
    _kraken = new KrakenClient(_config.key, _config.secret);

    tmp = ExKraken.getTradePairInfos();

    if (tmp != 'error') {
      _pairUnits.base = tmp[_config.pair].base;
      _pairUnits.quote = tmp[_config.pair].quote;
      return true;
    } else {
      return false;
    }
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
      future.return();
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
    return {base: _pairUnits.base.substring(1,4), quote: _pairUnits.quote.substring(1,4)};
  }


  this.getPrice = function() {
    return _price;
  }

  this.getActionPrice = function() {
    /* TODO: return bought or sold price */
    return 1;
  }

  this.buy = function() {
    /* TODO: implementing buy mechanism */
    return true;
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

  this.getAmount = function() {
    var future = new Future(); // to make async callback synchronous

  _kraken.api('Balance', null, function(error, data) {
    if (error) {
      console.log(error);
      future.return('error');
    } else {
      future.return();
      // future.return(data.result);
      console.log(data.result[_pairUnits.quote])
      // console.log(data)
    }
  });

  return future.wait();
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
