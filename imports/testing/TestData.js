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


// import { Instance } from '../dir/example.js';
// import './example.js';


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

// var _variable = 'Value';


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

// ClassName.Variable = 'Value';


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

export function TestData() {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  // InheritancesClass.apply(this);


  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  var _counter = 0;
  var _dataArray = new Array();



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

  this.reset = function() {
    _counter = 0;
  }

  this.setCounter = function(counter) {
    _counter = counter;
  }

  this.setData = function(dataArray) {
    _dataArray = Object.assign({}, dataArray);
  }

  this.update = function() {
    _counter++;
  }

  this.getSin = function(gain) {
    var deg2rad = _counter * 2 * Math.PI / 360;
    if (typeof gain == 'undefined'){
      return Math.sin(deg2rad) + 1;
    }

    return gain * (Math.sin(deg2rad) + 1);
  }

  this.getData = function() {
    return _dataArray[_counter % _dataArray.length];
  }


  this.getCounter = function(){
    return _counter;
  }

}
