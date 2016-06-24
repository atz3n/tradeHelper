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
import { KrakenApi } from '../../apis/KrakenApi.js'


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

// var _variable = 'Value';


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

ExKraken.ERROR_STRING = 'KrakenError';
ExKraken.Pair = KrakenApi.Pair;

ExKraken.ConfigDefault = {
  id: 'undefined',
  pair: ExKraken.Pair.btc_eur,
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

// ClassName.function = function(param){
//   return 'Value';
// }


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
  var _courseData;
  var _pairUnits = { base: 'none', quote: 'none' };

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
    var data = KrakenApi.getTicker(_config.pair);

    if (data === KrakenApi.ERROR_STRING) {
      return false;
    }

    _price = data.p[1];
    return true;
  }


  this.setConfig = function(configuration) {
    _config = Object.assign({}, configuration);


    switch (_config.pair) {
      case ExKraken.Pair.btc_eur:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'EUR';
        break;
      case ExKraken.Pair.eth_btc:
        _pairUnits.base = 'ETH';
        _pairUnits.quote = 'BTC';
        break;
      case ExKraken.Pair.eth_cad:
        _pairUnits.base = 'ETH';
        _pairUnits.quote = 'CAD';
        break;
      case ExKraken.Pair.eth_eur:
        _pairUnits.base = 'ETH';
        _pairUnits.quote = 'EUR';
        break;
      case ExKraken.Pair.eth_gbp:
        _pairUnits.base = 'ETH';
        _pairUnits.quote = 'GBP';
        break;
      case ExKraken.Pair.eth_jpy:
        _pairUnits.base = 'ETH';
        _pairUnits.quote = 'JPY';
        break;
      case ExKraken.Pair.eth_usd:
        _pairUnits.base = 'ETH';
        _pairUnits.quote = 'USD';
        break;
      case ExKraken.Pair.ltc_cad:
        _pairUnits.base = 'LTC';
        _pairUnits.quote = 'CAD';
        break;
      case ExKraken.Pair.ltc_eur:
        _pairUnits.base = 'LTC';
        _pairUnits.quote = 'EUR';
        break;
      case ExKraken.Pair.ltc_usd:
        _pairUnits.base = 'LTC';
        _pairUnits.quote = 'USD';
        break;
      case ExKraken.Pair.btc_ltc:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'LTC';
        break;
      case ExKraken.Pair.btc_nmc:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'NMC';
        break;
      case ExKraken.Pair.btc_xdg:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'XDG';
        break;
      case ExKraken.Pair.btc_xlm:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'XLM';
        break;
      case ExKraken.Pair.btc_xrp:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'XRP';
        break;
      case ExKraken.Pair.btc_cad:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'CAD';
        break;
      case ExKraken.Pair.btc_eur:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'EUR';
        break;
      case ExKraken.Pair.btc_gbp:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'GBP';
        break;
      case ExKraken.Pair.btc_jpy:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'JPY';
        break;
      case ExKraken.Pair.btc_usd:
        _pairUnits.base = 'BTC';
        _pairUnits.quote = 'USD';
        break;
      default:
        _pairUnits.base = 'none';
        _pairUnits.quote = 'none';
    }

    return true;
  }





  this.getConfig = function() {
    var tmp = Object.assign({}, _config);
    delete tmp.id;
    return tmp;
  }


  this.getStatus = function() {
    return 'OK';
  }


  this.getInfo = function() {}


  this.getPairUnits = function() {
    return _pairUnits;
  }


  this.getPrice = function() {
    return _price;
  }

  this.getActionPrice = function() {
    /* TODO: return bought or sold price */
    return _price;
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

  this.getAmount = function(){
    /* TODO return amount */
    return 0;
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/

  // var _constructor = function(param){
  // }

  // _constructor(ConstrParam)
}
