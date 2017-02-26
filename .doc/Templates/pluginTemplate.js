
/**
 * @description:
 * <Description>
 *
 * 
 * <Optional informations>
 *
 * 
 * @author <Your Name>
 * @version 1.0.0
 *
 * 
 * CHANGES:
 * 02-Jun-2015 : Initial version
 */

/***********************************************************************
------------------------
    HOW TO USE
------------------------

This is a template for an Plugin. It includes the IPlugin interface functions
and some basic logic.


Replace the fields marked with <YOUR CODE: <some description>> with your code inside.

Of course, your allowed to add any, delete or modify every line inside this template as long
as the functionality is kept and the api's are served.


Delete this How To area after finishing your work.

************************************************************************/



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
<YOUR CODE: plugin name with prefix "Pl">.ConfigDefault = {
  id: 'undefined',
  name: 'undefined',

  <YOUR CODE: plugin specific config variables> 

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

export function <YOUR CODE: plugin name with prefix "Pl">(logger) {

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
  var _config = Object.assign({}, <YOUR CODE: Plugin name with prefix "Pl">.ConfigDefault);

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


  <YOUR CODE: private variables>


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

    <YOUR CODE: configuration checks>

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
    _logPreMsg = '<YOUR CODE: plugin name with prefix "Pl"> ' + configuration.id + ': ';
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
      <YOUR CODE: configuration array objects>
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
      <YOUR CODE: information array objects>
    ];

    <YOUR CODE: some view logic>

    if(!_active) for(i in tmp) tmp[i].value = '-';

    return tmp;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.start = function(price) {
    logger.debug(_logPreMsg + 'start()');


    _position = 'none';

    <YOUR CODE: set some price values>

    /* set active state */
    <YOUR CODE: set _active value to true/false>
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.reset = function(price) {
    logger.debug(_logPreMsg + 'reset()');


    if(_active) {
      <YOUR CODE: set some price values>
    }
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.update = function(price) {
    if(_active){

      logger.debug(_logPreMsg + 'update() start');

      
       _curPrice = price;

       
      <YOUR CODE: update logic> // add logger.verbose(_logPreMsg + 'buy notification'); / logger.verbose(_logPreMsg + 'sell notification')); 
                                // when calling _buyNotifyFunc / _sellNotifyFunc


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
        
        <YOUR CODE: set _active variable to true/false>
        <YOUR CODE: set your price variable>

        _inVolume = volume;
      } 


      /* short out */
      else 
      {
        _position = 'none';
        
        <YOUR CODE: set _active variable to true/false>
        <YOUR CODE: set your price variable>

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

      /* short in */
      if (_position === 'none') 
      {
        _position = 'short';

        <YOUR CODE: set _active variable to true/false>
        <YOUR CODE: set your price variable>

        _inVolume = volume;
      } 


      /* long out */
      else 
      {
        _position = 'none';

        <YOUR CODE: set _active variable to true/false>
        <YOUR CODE: set your price variable>

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
    return { id: _config.id, name: _config.name, type: "<YOUR CODE: plugin name with prefix "Pl">" };
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
