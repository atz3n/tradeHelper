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

/***********************************************************************
  Public Static Variable
 ***********************************************************************/

/**
 * Configuration structure
 * @type {Object}
 */
PlSafetyLineOut.ConfigDefault = {
  id: 'undefined',
  name: 'undefined',

  safetyLineBase: 'profit', // price (curPrice - inPrice), profit ((curPrice - inPrice) * inVolume)

  safetyLineType: 'value', // value (total amount), percentage (relative to in price)
  safetyLineStepWidth: 5,


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

export function PlSafetyLineOut(logger) {

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
  var _config = Object.assign({}, PlSafetyLineOut.ConfigDefault);

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
   * In Price
   * @type {Number}
   */
  var _inPrice = 0;

  /**
   * safety line exceeded counter
   * @type {Number}
   */
  var _sflExCnt = 0;

  /**
   * safety line step counter
   * @type {Number}
   */
  var _stepCnt = 0;

    /**
   * safety line step width
   * @type {Number}
   */
  var _stepDiff = 0;

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

    if (_config.safetyLineBase !== 'price' && _config.safetyLineBase !== 'profit') return false;

    if (_config.safetyLineType !== 'value' && _config.safetyLineType !== 'percentage') return false;

    if (isNaN(_config.safetyLineStepWidth)) return false;
    if (_config.safetyLineStepWidth < 0) return false;

    if (_config.safetyLineType === 'percentage') {
        if (_config.safetyLineStepWidth > 100) return false;
    }

    if (typeof _config.enLong !== 'boolean') return false;
    if (typeof _config.enShort !== 'boolean') return false;

    return true;
  }


  var _calcStepDiff = function() {
    let diff = 0;

    if (_config.safetyLineType === 'percentage') {
        diff = _inPrice * _config.safetyLineStepWidth / 100;
    } else {
        diff = _config.safetyLineStepWidth;
    }

    if (_config.safetyLineBase === 'profit') diff *= _inVolume;

    _stepDiff = diff;
  }


  var _resetVars = function() {
    _stepCnt = 0;
    _stepDiff = 0;
    _sflExCnt = 0;
    _inPrice = 0;
    _inVolume = 0;
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.setConfig = function(configuration) {
    _logPreMsg = 'PlSafetyLineOut ' + configuration.id + ': ';
    logger.debug(_logPreMsg + 'setConfig()');


    _config = mergeObjects(_config, configuration);

    _config.safetyLineExceedCnt = 1; // For future integration

    return _checkConfig();
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getConfig = function() {
    logger.debug(_logPreMsg + 'getConfig()');
    

    return [
      { title: 'Safety Line Base', value: _config.safetyLineBase },
      { title: 'Safety Line Type', value: _config.safetyLineType },
      { title: 'Safety Line Step Width', value: _config.safetyLineStepWidth },
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
      { title: 'Safety Line', value: '-' },
      { title: 'Current Price', value: cropFracDigits(_curPrice, 6) }
    ];

    if (_position === 'long' && _stepCnt > 0) tmp[0].value = cropFracDigits(_inPrice + _stepCnt * _stepDiff, 6)
    if (_position === 'short' && _stepCnt > 0) tmp[0].value = cropFracDigits(_inPrice - _stepCnt * _stepDiff, 6)

    if(!_active) for(i in tmp) tmp[i].value = '-';

    return tmp;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.start = function(price) {
    logger.debug(_logPreMsg + 'start()');


    _position = 'none';


    /* set active state */
    _active = false;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.reset = function(price) {
    logger.debug(_logPreMsg + 'reset()');


    if(_active) {
      _stepCnt = 0;
      _sflExCnt = 0;
    }
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.update = function(price) {
    if(_active){

      logger.debug(_logPreMsg + 'update() start');


      _curPrice = price;



      /* stop long position */
      if (_position === 'long') {
        
        if(_curPrice >= _inPrice + (_stepCnt + 1) * _stepDiff) _stepCnt++;

        if(_stepCnt !== 0) {

          if (_curPrice < _inPrice + _stepCnt * _stepDiff) _sflExCnt++;
          else _sflExCnt = 0;

          if (_sflExCnt >= _config.safetyLineExceedCnt) {
              logger.verbose(_logPreMsg + 'sell notification');
              _sellNotifyFunc(this.getInstInfo());
          }
        }
      }


      /* stop short position */
      if (_position === 'short') {

        if(_curPrice <= _inPrice - (_stepCnt + 1) * _stepDiff) _stepCnt++;

        if(_stepCnt !== 0) {

          if (_curPrice > _inPrice - _stepCnt * _stepDiff) _sflExCnt++;
          else _sflExCnt = 0;

          if (_sflExCnt >= _config.safetyLineExceedCnt) {
              logger.verbose(_logPreMsg + 'buy notification');
              _buyNotifyFunc(this.getInstInfo());
          }
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

      /* long in */
      if (_position === 'none') 
      {
        _position = 'long';
        
        if (_config.enLong) _active = true;
        _inPrice = price;
        _calcStepDiff();

        _inVolume = volume;
      } 


      /* short out */
      else 
      {
        _position = 'none';
        
        _active = false;
        _resetVars();
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

      /* short in */
      if (_position === 'none') 
      {
        _position = 'short';

         if (_config.enShort) _active = true;
        _inPrice = price;
        _calcStepDiff();

        _inVolume = volume;
      } 


      /* long out */
      else 
      {
        _position = 'none';

        _active = false;
        _resetVars();
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
    return { id: _config.id, name: _config.name, type: "PlSafetyLineOut" };
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
