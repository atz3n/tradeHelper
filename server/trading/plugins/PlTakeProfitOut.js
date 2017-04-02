/**
 * @description:
 * Class for take profit mechanism
 *
 * 
 * This class implements a safety take profit to safely take profit
 *
 * 
 * @author Atzen
 * @version 0.5.0
 *
 * 
 * CHANGES:
 * 05-Sep-2016 : Initial version
 * 31-Oct-2016 : Added savety mechanism in bought/sold functions
 * 28-Nov-2016 : Added takeValueBase option
 * 12-Dez-2016 : Added _active mechanism
 * 05-Jan-2017 : adapted to IPlugin v 4.0.0
 * 11-Jan-2017 : added logging mechanism
 * 02-Apr-2017 : renamed PlTakeProfit -> PlTakeProfitOut
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
PlTakeProfitOut.ConfigDefault = {
  id: 'undefined',
  name: 'undefined',

  takeValueBase: 'profit', // price (curPrice - inPrice), profit ((curPrice - inPrice) * inVolume)

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

export function PlTakeProfitOut(logger) {

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
  var _config = Object.assign({}, PlTakeProfitOut.ConfigDefault);

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
   * message string that a log message starts with
   * @type {String}
   */
  var _logPreMsg = '';

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

    if (_config.takeValueBase !== 'price' && _config.takeValueBase !== 'profit') return false;

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
    _logPreMsg = 'PlTakeProfitOut ' + configuration.id + ': ';
    logger.debug(_logPreMsg + 'setConfig()');


    _config = mergeObjects(_config, configuration);


    return _checkConfig();
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getConfig = function() {
    logger.debug(_logPreMsg + 'getConfig()');


    return [
      { title: 'Take Value Base', value: _config.takeValueBase },
      { title: 'Take Value Type', value: _config.takeValueType },
      { title: 'Take Value', value: _config.takeValueAmount },
      { title: 'Enable Long', value: JSON.stringify(_config.enLong) },
      { title: 'Enable Short', value: JSON.stringify(_config.enShort) }
    ];
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getActiveState = function() {
    logger.debug(_logPreMsg + 'getActiveState()');
    return _active;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getInfo = function() {
    logger.debug(_logPreMsg + 'getInfo()');


    var tmp = [
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
    logger.debug(_logPreMsg + 'start()');


    _position = 'none';

    _active = false;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.reset = function(price) {
    logger.debug(_logPreMsg + 'reset()');
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.update = function(price) {
    if(_active){

      logger.debug(_logPreMsg + 'update() start');


      var diff = 0;
      _curPrice = price;


      /* get difference */
      if (_config.takeValueType === 'percentage') {
        diff = percentage(_curPrice, _inPrice);
      } else {
        diff = _curPrice - _inPrice;

        if (_config.takeValueBase === 'profit') diff *= _inVolume;
      }


      /* stop long position */
      if (_position === 'long' && _config.enLong) {
        if (diff > _config.takeValueAmount) {
          logger.verbose(_logPreMsg + 'sell notification');
          _sellNotifyFunc(this.getInstInfo());
        }
      }


      /* stop short position */
      if (_position === 'short' && _config.enShort) {
        if (diff < - _config.takeValueAmount) {
          logger.verbose(_logPreMsg + 'buy notification');
          _buyNotifyFunc(this.getInstInfo());
        }
      }


      logger.debug(_logPreMsg + 'update() end');
    }
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.bought = function(price, volume) {
    logger.debug(_logPreMsg + 'bought()');


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
    logger.debug(_logPreMsg + 'sold()');


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
    logger.debug(_logPreMsg + 'setBuyNotifyFunc()');
    _buyNotifyFunc = buyNotifyFunction;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.setSellNotifyFunc = function(sellNotifyFunction) {
    logger.debug(_logPreMsg + 'setSellNotifyFunc()');
    _sellNotifyFunc = sellNotifyFunction;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getInstInfo = function() {
    logger.debug(_logPreMsg + 'getInstInfo()');
    return { id: _config.id, name: _config.name, type: "PlTakeProfitOut" };
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getPositions = function() {
    logger.debug(_logPreMsg + 'getPositions()');
    return { long: _config.enLong, short: _config.enShort }
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/
}
