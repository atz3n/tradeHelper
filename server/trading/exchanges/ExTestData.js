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
  sinus: 'sin',
  data: 'dat'
}

ExTestData.ConfigDefault = {
  id: 'undefined',
  priceType: ExTestData.priceType.sin,
  counter: 0,
  data: [],
  gain: 1
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
    _counter++;
  }


  this.setConfig = function(config) {
    _config = Object.assign({}, config);
    _counter = _config.counter;
    _dataArray = _config.data;
  }


  this.getConfig = function() {
    return _config;
  }


  this.getStatus = function() {
    return 'OK';
  }


  this.getInfo = function() {}


  this.getPairUnits = function() {
    return {counter: '', denominator: ''};
  }


  this.getPrice = function() {
    var price;

    switch (_config.priceType) {


      case ExTestData.priceType.sinus:
        price = _config.gain * (Math.sin(_counter * 2 * Math.PI / 360) + 1);
        break;

      case ExTestData.priceType.input:
        price = _config.gain * _dataArray[_counter % _dataArray.length];
        break;

      default:
        price = 0;
    }

    return price;
  }



  this.sell = function() {}

  this.buy = function() {}


  this.getInstInfo = function() {
    return {
      id: _config.id,
      type: "ExTestData"
    }
  }

}
