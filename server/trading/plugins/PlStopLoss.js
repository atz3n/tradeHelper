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


import { IPlugin } from '../../apis/IPlugin.js'


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

// var _variable = function(param){
//   return 'Value';
// }


/***********************************************************************
  Public Static Function
 ***********************************************************************/

PlStopLoss.ConfigDefault = {
  id: 'undefined',

  stopValueType: 'value', // value (total amount), percentage (relative to in price)
  stopValueAmount: 0,

  enableLong: true,
  enableShort: true
}

/***********************************************************************
  Class
 ***********************************************************************/

export function PlStopLoss(logger) {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  IPlugin.apply(this);


  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  var _config = Object.assign({}, PlSwing.ConfigDefault);


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  // this.Variable = 'Value'; 


  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  var _checkConfig = function() {
    if (_config.id === 'undefined') return false;

    if (_config.stopValueType !== 'value' && _config.stopValueType !== 'percentage') return false;

    if (isNaN(_config.stopValueAmount)) return false;
    if (_config.stopValueAmount < 0) return false;

    if (_config.stopValueType === 'percentage') {
      if (_config.stopValueAmount > 100) return false;
    }

    if (typeof _config.enableLong !== 'boolean') return false;
    if (typeof _config.enableShort !== 'boolean') return false;

    return true;
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  this.setConfig = function() {
    _config = mergeObjects(_config, configuration);
    return _checkConfig();
  }


  this.getConfig = function() {
    throw new Error('This method must be overwritten!');
  }


  this.getState = function() {
    throw new Error('This method must be overwritten!');
  }


  this.getInfo = function() {
    throw new Error('This method must be overwritten!');
  }


  this.start = function(price) {
    throw new Error('This method must be overwritten!');
  }


  this.update = function(price) {
    throw new Error('This method must be overwritten!');
  }


  this.bought = function(price) {
    throw new Error('This method must be overwritten!');
  }


  this.sold = function(price) {
    throw new Error('This method must be overwritten!');
  }


  this.setBuyNotifyFunc = function(buyNotifyFunction) {
    throw new Error('This method must be overwritten!');
  }


  this.setSellNotifyFunc = function(sellNotifyFunction) {
    throw new Error('This method must be overwritten!');
  }


  this.getInstInfo = function() {
    throw new Error('This method must be overwritten!');
  }


  this.getPositions = function() {
    return { long: _config.enableLong, short: _config.enableShort }
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/

  // var _constructor = function(param){
  // }

  // _constructor(ConstrParam)
}
