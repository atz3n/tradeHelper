/**
 * @description:
 * <Description>
 *
 * <Optional informations>
 * 
 * @author Atzen
 * @version 1.0
 * 
 * CHANGES:
 * 02-Jun-2015 : Initial version
 */


import { IExchange } from '../../apis/IExchange.js';


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

// var _variable = 'Value';


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

ExTestData.priceType = {
  sinus: 'Sinus',
  data: 'Data'
}

ExTestData.ConfigDefault = {
  id: 'undefined',
  priceType: ExTestData.priceType.sin,
  startVal: 0,
  data: [],
  gain: 1,
  qAmount: 100,
  offset: 0,
  stepWidth: 1,
  bUnit: '',
  qUnit: ''
}



/***********************************************************************
  Private Static Function
 ***********************************************************************/

// var variable = function(param){
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

export function ExTestData() {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  IExchange.apply(this);


  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  var _counter = 0;
  var _dataArray = new Array();
  var _config = Object.assign({}, ExTestData.ConfigDefault);


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  // this.Variable = 'Value'; 


  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  // var functionName = function(param) {
  //   return 'Value';
  // }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/


  this.update = function() {
    _counter += _config.stepWidth;
  }


  this.setConfig = function(config) {
    _config = Object.assign({}, config);
    _counter = _config.startVal;
    _dataArray = _config.data;
  }


  this.getConfig = function() {
    var conf = {};

    conf.PriceType = _config.priceType;
    conf.StartValue = _config.startVal;
    conf.Data = _config.data;
    conf.Gain = _config.gain;
    conf.QuoteAmount = _config.qAmount + ' ' + _config.qUnit;
    conf.Offset = _config.offset;
    conf.StepWidth = _config.stepWidth;
    
    return conf;
  }


  this.getStatus = function() {
    return 'OK';
  }


  this.getInfo = function() {}


  this.getPairUnits = function() {
    return { base: _config.bUnit, quote: _config.qUnit };
  }


  this.getPrice = function() {
    var price;

    switch (_config.priceType) {

      case ExTestData.priceType.sinus:
        price = _config.gain * (Math.sin(_counter * 2 * Math.PI / 360) + 1) + _config.offset;
        break;

      case ExTestData.priceType.input:
        price = _config.gain * _dataArray[_counter % _dataArray.length] + _config.offset;
        break;

      default:
        price = 0;
    }

    return price;
  }

  this.getActionPrice = function() {
    return this.getPrice();
  }

  this.getVolume = function() {
    return _config.qAmount / this.getPrice();
  }

  this.sell = function() {return true;}

  this.buy = function() {return true;}


  this.getInstInfo = function() {
    return {
      id: _config.id,
      type: "ExTestData"
    }
  }

}
