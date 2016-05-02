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

   // InheritancesClass.apply(this);
   

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/
  
  var _config = Object.assign({}, ExKraken.ConfigDefault);
  var _courseData;

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

    if(data === KrakenApi.ERROR_STRING){
      return false;
    }

    _courseData = data.p;
    return true;
  }
  

  this.setConfig = function(configuration) {
    _config = Object.assign({}, configuration);
    return true;
  }





this.getConfig = function() {
    return _config;
}


this.getStatus = function() {
}


this.getInfo = function() {
}


this.getCourse = function() {
    return _courseData;
}

this.buy = function() {
  /* TODO: implementing buy mechanism */
    return true;
}

this.sell = function() {
  /* TODO: implementing sell mechanism */
  return true;    
}


  /***********************************************************************
    Constructor
   ***********************************************************************/

   // var _constructor = function(param){
   // }

   // _constructor(ConstrParam)
}
