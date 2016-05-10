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
  var _pairUnits = { counter: 'none', denominator: 'none' };

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
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'EUR';
        break;
      case ExKraken.Pair.eth_btc:
        _pairUnits.counter = 'ETH';
        _pairUnits.denominator = 'BTC';
        break;
      case ExKraken.Pair.eth_cad:
        _pairUnits.counter = 'ETH';
        _pairUnits.denominator = 'CAD';
        break;
      case ExKraken.Pair.eth_eur:
        _pairUnits.counter = 'ETH';
        _pairUnits.denominator = 'EUR';
        break;
      case ExKraken.Pair.eth_gbp:
        _pairUnits.counter = 'ETH';
        _pairUnits.denominator = 'GBP';
        break;
      case ExKraken.Pair.eth_jpy:
        _pairUnits.counter = 'ETH';
        _pairUnits.denominator = 'JPY';
        break;
      case ExKraken.Pair.eth_usd:
        _pairUnits.counter = 'ETH';
        _pairUnits.denominator = 'USD';
        break;
      case ExKraken.Pair.ltc_cad:
        _pairUnits.counter = 'LTC';
        _pairUnits.denominator = 'CAD';
        break;
      case ExKraken.Pair.ltc_eur:
        _pairUnits.counter = 'LTC';
        _pairUnits.denominator = 'EUR';
        break;
      case ExKraken.Pair.ltc_usd:
        _pairUnits.counter = 'LTC';
        _pairUnits.denominator = 'USD';
        break;
      case ExKraken.Pair.btc_ltc:
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'LTC';
        break;
      case ExKraken.Pair.btc_nmc:
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'NMC';
        break;
      case ExKraken.Pair.btc_xdg:
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'XDG';
        break;
      case ExKraken.Pair.btc_xlm:
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'XLM';
        break;
      case ExKraken.Pair.btc_xrp:
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'XRP';
        break;
      case ExKraken.Pair.btc_cad:
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'CAD';
        break;
      case ExKraken.Pair.btc_eur:
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'EUR';
        break;
      case ExKraken.Pair.btc_gbp:
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'GBP';
        break;
      case ExKraken.Pair.btc_jpy:
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'JPY';
        break;
      case ExKraken.Pair.btc_usd:
        _pairUnits.counter = 'BTC';
        _pairUnits.denominator = 'USD';
        break;
      default:
        _pairUnits.counter = 'none';
        _pairUnits.denominator = 'none';
    }

    return true;
  }





  this.getConfig = function() {
    return _config;
  }


  this.getStatus = function() {}


  this.getInfo = function() {}


  this.getPairUnits = function() {
    return _pairUnits;
  }


  this.getPrice = function() {
    console.log('Price called')
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



  /***********************************************************************
    Constructor
   ***********************************************************************/

  // var _constructor = function(param){
  // }

  // _constructor(ConstrParam)
}
