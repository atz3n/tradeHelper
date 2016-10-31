/**
 * @description:
 * Class for take profit mechanism
 *
 * 
 * This class implements a safety take profit to safely take profit
 *
 * 
 * @author Atzen
 * @version 0.2.0
 *
 * 
 * CHANGES:
 * 05-Sep-2016 : Initial version
 * 31-Oct-2016 : Added savety mechanism in bought/sold functions
 */


import { IPlugin } from '../../apis/IPlugin.js'


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

/***********************************************************************
  Public Static Variable
 ***********************************************************************/

/**
 * Configuration structure
 * @type {Object}
 */
PlTakeProfit.ConfigDefault = {
  id: 'undefined',
  name: 'undefined',

  takeValueType: 'value', // value (total amount), percentage (relative to in price)
  takeValueAmount: 0,

  enLong: true, // enable long trading
  enShort: true // enable short trading
}


/***********************************************************************
  Private Static Function
 ***********************************************************************/

/***********************************************************************
  Public Static Function
 ***********************************************************************/

/***********************************************************************
  Class
 ***********************************************************************/

export function PlTakeProfit(logger) {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  IPlugin.apply(this);


  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  /**
   * Internal configuration object
   * @type {Object}
   */
  var _config = Object.assign({}, PlTakeProfit.ConfigDefault);

  /**
   * Position in price
   * @type {Number}
   */
  var _inPrice = 0;

  /**
   * Current Price
   * @type {Number}
   */
  var _curPrice = 0;

  /**
   * Trade position
   * @type {String}
   */
  var _position = 'none';

  /**
   * Callback function that will be called when a buy action is calculated
   */
  var _buyNotifyFunc = function() {};

  /**
   * Callback function that will be called when a sell action is calculated
   */
  var _sellNotifyFunc = function() {};


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /**
   * Checks configuration
   * @return {bool} false if error occurs
   */
  var _checkConfig = function() {
    if (_config.id === 'undefined') return false;

    if (_config.takeValueType !== 'value' && _config.takeValueType !== 'percentage') return false;

    if (isNaN(_config.takeValueAmount)) return false;
    if (_config.takeValueAmount < 0) return false;

    if (_config.takeValueType === 'percentage') {
      if (_config.takeValueAmount > 100) return false;
    }

    if (typeof _config.enLong !== 'boolean') return false;
    if (typeof _config.enShort !== 'boolean') return false;

    return true;
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.setConfig = function(configuration) {
    _config = mergeObjects(_config, configuration);
    return _checkConfig();
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getConfig = function() {
    return [
      { title: 'Take Value Type', value: _config.takeValueType },
      { title: 'Take Value', value: _config.takeValueAmount },
      { title: 'Enable Long', value: JSON.stringify(_config.enLong) },
      { title: 'Enable Short', value: JSON.stringify(_config.enShort) }
    ];
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getState = function() {
    if (_position === 'none') return 'out';
    else return 'in';
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getInfo = function() {
    return [
      { title: 'In Price', value: cropFracDigits(_inPrice, 6) },
      { title: 'Current Price', value: cropFracDigits(_curPrice, 6) },
    ];
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.start = function(price) {
    _curPrice = price;
    _position = 'none';
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.update = function(price) {
    _curPrice = price;


    /* stop long position */
    if (_position === 'long' && _config.enLong) {
      if (_config.takeValueType === 'value') {
        if (_curPrice - _inPrice > _config.takeValueAmount) {
          _sellNotifyFunc(this.getInstInfo());
        }
      }

      if (_config.takeValueType === 'percentage') {
        if (percentage(_curPrice, _inPrice) > _config.takeValueAmount) {
          _sellNotifyFunc(this.getInstInfo());
        }
      }
    }


    /* stop short position */
    if (_position === 'short' && _config.enShort) {
      if (_config.takeValueType === 'value') {
        if (_curPrice - _inPrice < -_config.takeValueAmount) {
          _buyNotifyFunc(this.getInstInfo());
        }
      }

      if (_config.takeValueType === 'percentage') {
        if (percentage(_curPrice, _inPrice) < -_config.takeValueAmount) {
          _buyNotifyFunc(this.getInstInfo());
        }
      }
    }
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.bought = function(price) {
    if (_position !== 'long') { // for savety reasons

      if (_position === 'none') {
        _position = 'long';
        _inPrice = price;
      } else {
        _position = 'none';
        _inPrice = 0;
      }

      _curPrice = price;
    }
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.sold = function(price) {
    if (_position !== 'short') { // for savety reasons
      
      if (_position === 'none') {
        _position = 'short';
        _inPrice = price;
      } else {
        _position = 'none';
        _inPrice = 0;
      }

      _curPrice = price;
    }
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.setBuyNotifyFunc = function(buyNotifyFunction) {
    _buyNotifyFunc = buyNotifyFunction;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.setSellNotifyFunc = function(sellNotifyFunction) {
    _sellNotifyFunc = sellNotifyFunction;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getInstInfo = function() {
    return { id: _config.id, name: _config.name, type: "PlTakeProfit" };
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getPositions = function() {
    return { long: _config.enableLong, short: _config.enableShort }
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/

}
