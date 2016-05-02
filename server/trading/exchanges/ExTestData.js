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

ExTestData.courseType = {
  sinus: 'sin',
  input: 'inp'
}

ExTestData.ConfigDefault = {
  courseType: ExTestData.courseType.sin,
  counter: 0,
  inputData: [],
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

  // InheritancesClass.apply(this);


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
    _dataArray = _config.inputData;
  }


  this.getConfig = function() {
    return _config;
  }


  this.getStatus = function() {}


  this.getInfo = function() {}


  this.getCourse = function() {
    var course;

    switch (_config.courseType) {

      case ExTestData.courseType.sinus:
        course = _config.gain * (Math.sin(_counter * 2 * Math.PI / 360) + 1);
        break;

      case ExTestData.courseType.input:
        course = _dataArray[_counter % _dataArray.length];
        break;

      default:
        course = 0;
    }

    return course;

  }



  this.sell = function() {}

  this.buy = function() {}

}
