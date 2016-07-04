/**
 * @description:
 * Emulates a real exchange
 *
 * 
 * @author Atzen
 * @version 0.1.0
 * 
 * CHANGES:
 * 04-July-2016 : Initial version
 */


import { IExchange } from '../../apis/IExchange.js';


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
ExTestData.ConfigDefault = {
  id: 'undefined',

  priceType: 'sinus', // sinus (sinus shaped price flow), data (uses data array)
  data: [], // data array
  
  startVal: 0, // counter start value
  gain: 1, // multiplicator
  offset: 0, 
  stepWidth: 1, // counter increment step width
  
  balanceAmount: 100, // starting amount
  
  tradeDelaySec: 3 // trade seconds
}


/***********************************************************************
  Private Static Function
 ***********************************************************************/

/***********************************************************************
  Public Static Function
 ***********************************************************************/

/**
 * Interface function (see IExchange.js for detail informations)
 */
ExTestData.getTradePairInfos = function() {
  return errHandle(ExError.ok, 'base2quote');
}


/***********************************************************************
  Class
 ***********************************************************************/

export function ExTestData() {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  IExchange.apply(this);


  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  /**
   * Counter value that will be incremented each update call
   * @type {Number}
   */
  var _counter = 0;

  /**
   * Holds the _config.data data
   * @type {Array}
   */
  var _dataArray = new Array();

  /**
   * Internal configuration object
   * @type {Object}
   */
  var _config = Object.assign({}, ExTestData.ConfigDefault);

  /**
   * Indicates an trade cancellation
   * @type {Boolean}
   */
  var _cancelTrade = false;

/**
 * Balanced used to calculate trading amount
 * @type {Number}
 */
  var _balance = 0;

  /**
   * Trading amount
   * @type {Number}
   */
  var _volume = 0;

  /**
   * Bought notification callback function
   * @type {Function}
   */
  var _boughtNotifyFunc = function() {};

  /**
   * Sold notification callback function
   * @type {Function}
   */
  var _soldNotifyFunc = function() {};


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

    if (_config.priceType !== 'sinus' && _config.priceType !== 'data') return false;
    if (typeof _config.data !== 'array') errHandle(ExError, null);

    if (isNaN(_config.startVal)) return false;
    if (isNaN(_config.offset)) return false;
    if (isNaN(_config.stepWidth)) return false;
    if (isNaN(_config.gain)) return false;

    if (isNaN(_config.balanceAmount)) return false;
    
    if (isNaN(_config.tradeDelaySec)) return false;

    return true;
  }

  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.update = function() {
    _counter += _config.stepWidth;
    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.setConfig = function(configuration) {
    _config = mergeObjects(_config, configuration);

    if(!_checkConfig) return errHandle(ExError.error, null);
    
    _counter = _config.startVal;
    _dataArray = _config.data;
    _balance = _config.balanceAmount;

    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getConfig = function() {
    var tmp = Object.assign({}, _config);
    delete tmp.id;

    return errHandle(ExError.ok, tmp);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getInfo = function() {
    return errHandle(ExError.ok, [{ title: 'Counter Value', value: _counter },
      { title: 'Balance', value: _balance }
    ]);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getPairUnits = function() {
    return errHandle(ExError.ok, { base: 'BAS', quote: 'QTE' });
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getPrice = function() {
    var price;

    switch (_config.priceType) {

      case 'sinus':
        price = Math.abs(_config.gain * (Math.sin(_counter * 2 * Math.PI / 360) + 1) + _config.offset);
        break;

      case 'data':
        price = Math.abs(_config.gain * _dataArray[_counter % _dataArray.length] + _config.offset);
        break;

      default:
        price = 0;
    }

    return errHandle(ExError.ok, price);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getTradePrice = function() {
    return errHandle(ExError.ok, this.getPrice().result);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getVolume = function() {
    return errHandle(ExError.ok, _volume);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.buy = async function(positon) {
    _cancelTrade = false;

    for (var i = 0; i < _config.tradeDelaySec; i++) {
      Meteor._sleepForMs(1000);
      if (_cancelTrade) break;
    }

    if (!_cancelTrade) {
      if ('long') {
        _volume = _balance / this.getPrice().result;
        _balance = 0;
      } else if ('short') {
        _balance = _volume * this.getPrice().result;
      } else {
        /* wrong parameter */
        _boughtNotifyFunc(this.getInstInfo(), errHandle(ExError.error, null));
        return;
      }
    } else {
      _volume = 0;
    }

    _cancelTrade = false;
    _boughtNotifyFunc(this.getInstInfo(), errHandle(ExError.ok, null));
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.sell = async function(positon) {
    _cancelTrade = false;

    for (var i = 0; i < _config.tradeDelaySec; i++) {
      Meteor._sleepForMs(1000);
      if (_cancelTrade) break;
    }

    if (!_cancelTrade) {
      if ('long') {
        _balance = _volume * this.getPrice().result;
      } else if ('short') {
        _volume = _balance / this.getPrice().result;
        _balance *= 2;
      } else {
        /* wrong parameter */
        _soldNotifyFunc(this.getInstInfo(), errHandle(ExError.error, null));
        return;
      }
    } else {
      _volume = 0;
    }

    _cancelTrade = false;
    _soldNotifyFunc(this.getInstInfo(), errHandle(ExError.ok, null));
  }


  this.stopTrade = function() {
    _cancelTrade = true;
    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getInstInfo = function() {
    return errHandle(ExError.ok, { id: _config.id, type: "ExTestData" });
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.setBoughtNotifyFunc = function(boughtNotifyFunction) {
    _boughtNotifyFunc = boughtNotifyFunction;
    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.setSoldNotifyFunc = function(soldNotifyFunction) {
    _soldNotifyFunc = soldNotifyFunction;
    return errHandle(ExError.ok, null);
  }
}
