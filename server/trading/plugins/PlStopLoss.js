/**
 * @description:
 * Class for stop loss mechanism
 *
 * 
 * This class implements a safety stop trade to minimize loss
 *
 * 
 * @author Atzen
 * @version 0.2.2
 *
 * 
 * CHANGES:
 * 12-Aug-2016 : Initial version
 * 31-Oct-2016 : Added savety mechanism in bought/sold functions
 * 28-Nov-2016 : Added stopValueBase option
 * 28-Nov-2016 : fixed bug: getPosition returned enLong config twice instead of enLong and enShort
 * 12-Dez-2016 : added _active mechanism
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
PlStopLoss.ConfigDefault = {
  id: 'undefined',
  name: 'undefined',

  stopValueBase: 'profit', // price (curPrice - inPrice), profit ((curPrice - inPrice) * inVolume)

  stopValueType: 'value', // value (total amount), percentage (relative to in price)
  stopValueAmount: 0,

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

export function PlStopLoss(logger) {

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
  var _config = Object.assign({}, PlStopLoss.ConfigDefault);

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
   * Position in Volume
   * @type {Number}
   */
  var _inVolume = 0;

  /**
   * Trade position
   * @type {String}
   */
  var _position = 'none';

  /**
  * Active state
  * @type {Boolean}
  */
  var _active = false;

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

    if (_config.stopValueBase !== 'price' && _config.stopValueBase !== 'profit') return false;
    
    if (_config.stopValueType !== 'value' && _config.stopValueType !== 'percentage') return false;

    if (isNaN(_config.stopValueAmount)) return false;
    if (_config.stopValueAmount < 0) return false;

    if (_config.stopValueType === 'percentage') {
      if (_config.stopValueAmount > 100) return false;
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
      { title: 'Stop Value Base', value: _config.stopValueBase },
      { title: 'Stop Value Type', value: _config.stopValueType },
      { title: 'Stop Value', value: _config.stopValueAmount },
      { title: 'Enable Long', value: JSON.stringify(_config.enLong) },
      { title: 'Enable Short', value: JSON.stringify(_config.enShort) }
    ];
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getActiveState = function() {
    return _active;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getInfo = function() {
    var tmp =  [
      { title: 'In Price', value: cropFracDigits(_inPrice, 6) },
      { title: 'Current Price', value: cropFracDigits(_curPrice, 6) }
    ];

    if(!_active) for(i in tmp) tmp[i].value = '-';

    return tmp;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.start = function(price) {
    _position = 'none';

    _active = false;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.update = function(price) {
    if(_active){

      var diff = 0;
      _curPrice = price;


      /* get difference */
      if (_config.stopValueType === 'percentage') {
        diff = percentage(_curPrice, _inPrice);
      } else {
        diff = _curPrice - _inPrice;

        if (_config.stopValueBase === 'profit') diff *= _inVolume;
      }


      /* stop long position */
      if (_position === 'long' && _config.enLong) {
        if (diff < -_config.stopValueAmount) {
          _sellNotifyFunc(this.getInstInfo());
        }
      }


      /* stop short position */
      if (_position === 'short' && _config.enShort) {
        if (diff > _config.stopValueAmount) {
          _buyNotifyFunc(this.getInstInfo());
        }
      }
    }
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.bought = function(price, volume) {
    if (_position !== 'long') { // for savety reasons

      if (_position === 'none') {
        _position = 'long';
        _active = true;
        _inPrice = price;
        _inVolume = volume;
      } else {
        _position = 'none';
        _active = false;
        _inPrice = 0;
        _inVolume = 0;
      }

      _curPrice = price;
    }
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.sold = function(price, volume) {
    if (_position !== 'short') { // for savety reasons

      if (_position === 'none') {
        _position = 'short';
        _active = true;
        _inPrice = price;
        _inVolume = volume;
      } else {
        _position = 'none';
        _active = false;
        _inPrice = 0;
        _inVolume = 0;
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
    return { id: _config.id, name: _config.name, type: "PlStopLoss" };
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getPositions = function() {
    return { long: _config.enLong, short: _config.enShort }
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/

}
