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

    _price = data.p;
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


this.getPrice = function() {
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
