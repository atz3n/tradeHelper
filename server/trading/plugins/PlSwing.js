/**
 * @description:
 * Class for swing like trading
 *
 * 
 * This class implements a so called swing like trading micro strategy
 *
 * 
 * @author Atzen
 * @version 0.1.0
 *
 * 
 * CHANGES:
 * 26-Jul-2016 : Initial version
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
PlSwing.ConfigDefault = {
  id: 'undefined',
  name: 'undefined',
  oLngPosPer: 5, // no position -> buy (value in percentage) (open long position)
  cLngPosPer: 5, // long position -> sell after top (value in percentage) (close long position)
  oShrtPosPer: 5, // no position -> sell (value in percentage) (open short position)
  cShrtPosPer: 5, // short position -> buy after bottom (value in percentage) (close short position)
  enLong: true, // enable long trading
  enShort: false // enable short trading
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

export function PlSwing(logger) {

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
  var _config = Object.assign({}, PlSwing.ConfigDefault);

  /**
   * Data object that contains all important values
   * @type {Object}
   */
  var _data = { currentVal: 0, topVal: 0, bottomVal: 0 }

  /**
   * Hold the current position
   * @type {Object}
   */
  var _positions = { long: false, short: false };

  /**
   * Callback function that will be called when a buy action is calculated
   */
  var _buyNotifyFunc = function() {};

  /**
   * Callback function that will be called when a sell action is calculated
   */
  var _sellNotifyFunc = function() {};

  /**
   * Temporary position (will be set when a buy or sell function is called)
   * Is used to determine a successful buy/sell action
   * @type {String}
   */
  var _tmpPos = 'init';

  /**
   * Logger object
   * @type {Logger}
   */
  var _logger = logger;


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /**
   * Function to log messages if a logger object is available
   * @param  {String} message message to be logged
   */
  var _log = function(message) {
    if (typeof _logger !== 'undefined')
      _logger.debug('PlSwing: ' + message);
  }


  /**
   * Checks configuration
   * @return {bool} false if error occurs
   */
  var _checkConfig = function() {
    if (_config.id === 'undefined') return false;
    if (_config.name === 'undefined') return false;

    if (isNaN(_config.oLngPosPer)) return false;
    if (_config.oLngPosPer < 0 || _config.oLngPosPer > 100) return false;

    if (isNaN(_config.cLngPosPer)) return false;
    if (_config.cLngPosPer < 0 || _config.cLngPosPer > 100) return false;

    if (isNaN(_config.oShrtPosPer)) return false;
    if (_config.oShrtPosPer < 0 || _config.oShrtPosPer > 100) return false;

    if (isNaN(_config.cShrtPosPer)) return false;
    if (_config.cShrtPosPer < 0 || _config.cShrtPosPer > 100) return false;

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
  this.update = function(price) {
    _data.currentVal = price;

    _data.topVal = Math.max(_data.topVal, _data.currentVal);
    _data.bottomVal = Math.min(_data.bottomVal, _data.currentVal);


    /* open long or short */
    if (!_positions.long && !_positions.short) {

      /* open short */
      if (_config.enShort) {
        if (Math.abs(percentage(_data.currentVal, _data.topVal)) >= _config.oShrtPosPer && _data.currentVal < _data.topVal) {
          _log('Short Open, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);

          _tmpPos = 'short';
          _sellNotifyFunc(this.getInstInfo());
        }
      }

      /* open long */
      if (_config.enLong) {
        if (Math.abs(percentage(_data.currentVal, _data.bottomVal)) >= _config.oLngPosPer && _data.currentVal > _data.bottomVal) {
          _log('Long Open, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);

          _tmpPos = 'long';
          _buyNotifyFunc(this.getInstInfo());
        }
      }

    }


    /* close short */
    if (!_positions.long && _positions.short) {
      if (Math.abs(percentage(_data.currentVal, _data.bottomVal)) >= _config.cShrtPosPer) {
        _log('Short Close, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);

        _tmpPos = 'short';
        _buyNotifyFunc(this.getInstInfo());
      }
    }

    /* close long */
    if (_positions.long && !_positions.short) {
      if (Math.abs(percentage(_data.currentVal, _data.topVal)) >= _config.cLngPosPer) {
        _log('Long Close, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);

        _tmpPos = 'long';
        _sellNotifyFunc(this.getInstInfo());
      }
    }
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getConfig = function() {
    return [
      { title: 'Open Long [%]', value: _config.oLngPosPer },
      { title: 'Close Long [%]', value: _config.cLngPosPer },
      { title: 'Open Short [%]', value: _config.oShrtPosPer },
      { title: 'Close Short [%]', value: _config.cShrtPosPer },
      { title: 'Enable Long', value: JSON.stringify(_config.enLong) },
      { title: 'Enable Short', value: JSON.stringify(_config.enShort) }
    ];
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getState = function() {
    if (_positions.long || _positions.short)
      return 'in';
    else
      return 'out';
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getInfo = function() {
    var info = {};

    info.Top = cropFracDigits(_data.topVal, 6);
    info.Current = cropFracDigits(_data.currentVal, 6);
    info.Bottom = cropFracDigits(_data.bottomVal, 6);

    return errHandle(ExError.ok, [
      { title: 'Top Value', value: cropFracDigits(_data.topVal, 6) },
      { title: 'Current Value', value: cropFracDigits(_data.currentVal, 6) },
      { title: 'Bottom Value', value: cropFracDigits(_data.bottomVal, 6) }
    ]);
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.start = function(price) {
    _log('start tracking');
    _data.currentVal = price;
    _data.bottomVal = price;
    _data.topVal = price;
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.bought = function(price) {
    _data.currentVal = price;
    _data.topVal = price;
    _data.bottomVal = price;

    if (_tmpPos === 'short') {
      _positions.short = false;

      _log('Short Closed, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);
    }

    if (_tmpPos === 'long') {
      _positions.long = true;

      _log('Long Opened, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);
    }
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.sold = function(price) {
    _data.currentVal = price;
    _data.topVal = price;
    _data.bottomVal = price;

    if (_tmpPos === 'short') {
      _positions.short = true;

      _log('Short Opened, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);
    }

    if (_tmpPos === 'long') {
      _positions.long = false;

      _log('Long Closed, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);
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
    return { id: _config.id, name: _config.name, type: "PlSwing" };
  }


  /**
   * Interface function (see IPlugin.js for detail informations)
   */
  this.getPositions = function() {
    return { long: _config.enLong, short: _config.enShort };
  }
}
