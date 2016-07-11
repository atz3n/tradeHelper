/**
 * @description:
 * Emulates a real exchange
 *
 * 
 * @author Atzen
 * @version 0.4.0
 * 
 * CHANGES:
 * 04-July-2016 : Initial version
 * 11-July-2016 : added throw error system
 * 11-July-2016 : added position configuration
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

  tradeDelaySec: 3, // trade seconds

  enLong: true, // enable long trading
  enShort: true, // enable short trading


  errSC: false, // setConfig() returns an error
  errGC: false, // getConfig() returns an error
  errGI: false, // getInfo() returns an error
  errGPU: false, // getPairUnits() returns an error
  errGV: false, // getVolume() returns an error
  errGP: false, // getPrice() returns an error
  errGTP: false, // getTradePrice() returns an error
  errU: false, // update() returns an error
  errS: false, // sell() returns an error
  errB: false, // buy() returns an error
  errST: false, // stopTrade() returns an error
  errGII: false, // getInstInfo() returns an error
  errGPO: false, // getPositions() returns an error
  errSBNF: false, // setBoughtNotifyFunc() returns an error
  errSSNF: false // setSoldNotifyFunc() returns an error
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

    if (_config.priceType === 'data') {
      if (typeof _config.data !== 'object') return false;
    }

    if (isNaN(_config.startVal)) return false;
    if (isNaN(_config.offset)) return false;
    if (isNaN(_config.stepWidth)) return false;
    if (isNaN(_config.gain)) return false;

    if (isNaN(_config.balanceAmount)) return false;

    if (isNaN(_config.tradeDelaySec)) return false;

    if (typeof _config.enLong !== 'boolean') return false;
    if (typeof _config.enShort !== 'boolean') return false;

    if (typeof _config.errSC !== 'boolean') return false;
    if (typeof _config.errGC !== 'boolean') return false;
    if (typeof _config.errGI !== 'boolean') return false;
    if (typeof _config.errGPU !== 'boolean') return false;
    if (typeof _config.errGV !== 'boolean') return false;
    if (typeof _config.errGP !== 'boolean') return false;
    if (typeof _config.errGTP !== 'boolean') return false;
    if (typeof _config.errU !== 'boolean') return false;
    if (typeof _config.errS !== 'boolean') return false;
    if (typeof _config.errB !== 'boolean') return false;
    if (typeof _config.errST !== 'boolean') return false;
    if (typeof _config.errGII !== 'boolean') return false;
    if (typeof _config.errGPO !== 'boolean') return false;
    if (typeof _config.errSBNF !== 'boolean') return false;
    if (typeof _config.errSSNF !== 'boolean') return false;

    return true;
  }

  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.update = function() {
    if (_config.errU) return errHandle(ExError.error, null);

    _counter += _config.stepWidth;
    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.setConfig = function(configuration) {
    if (configuration.errSC === undefined) {
      if (_config.errSC) return errHandle(ExError.error, null);
    } else {
      if (configuration.errSC) return errHandle(ExError.error, null);
    }

    _config = mergeObjects(_config, configuration);

    if (!_checkConfig()) return errHandle(ExError.error, null);

    _counter = _config.startVal;
    _dataArray = _config.data;
    _balance = _config.balanceAmount;

    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getConfig = function() {
    if (_config.errGC) return errHandle(ExError.error, null);

    var tmp = Object.assign({}, _config);
    delete tmp.id;

    return errHandle(ExError.ok, tmp);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getInfo = function() {
    if (_config.errGI) return errHandle(ExError.error, null);

    return errHandle(ExError.ok, [{ title: 'Counter Value', value: _counter },
      { title: 'Balance', value: _balance }
    ]);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getPairUnits = function() {
    if (_config.errGPU) return errHandle(ExError.error, null);

    return errHandle(ExError.ok, { base: 'BAS', quote: 'QTE' });
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getPrice = function() {
    if (_config.errGP) return errHandle(ExError.error, null);

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
    if (_config.errGTP) return errHandle(ExError.error, null);

    return errHandle(ExError.ok, this.getPrice().result);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getVolume = function() {
    if (_config.errGV) return errHandle(ExError.error, null);

    return errHandle(ExError.ok, _volume);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.buy = async function(positon) {
    if (_config.errB) return _boughtNotifyFunc(this.getInstInfo().result, errHandle(ExError.error, null));

    _cancelTrade = false;

    for (var i = 0; i < _config.tradeDelaySec; i++) {
      Meteor._sleepForMs(1000);
      if (_cancelTrade) break;
    }

    if (!_cancelTrade) {
      if ('none') {
        _volume = _balance / this.getPrice().result;
        _balance = 0;
      } else if ('short') {
        _balance = _volume * this.getPrice().result;
      } else {
        /* wrong parameter */
        _boughtNotifyFunc(this.getInstInfo().result, errHandle(ExError.error, null));
        return;
      }
    } else {
      _volume = 0;
    }

    _cancelTrade = false;
    _boughtNotifyFunc(this.getInstInfo().result, errHandle(ExError.ok, null));
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.sell = async function(positon) {
    if (_config.errS) return _soldNotifyFunc(this.getInstInfo().result, errHandle(ExError.error, null));

    _cancelTrade = false;

    for (var i = 0; i < _config.tradeDelaySec; i++) {
      Meteor._sleepForMs(1000);
      if (_cancelTrade) break;
    }

    if (!_cancelTrade) {
      if ('long') {
        _balance = _volume * this.getPrice().result;
      } else if ('none') {
        _volume = _balance / this.getPrice().result;
        _balance *= 2;
      } else {
        /* wrong parameter */
        _soldNotifyFunc(this.getInstInfo().result, errHandle(ExError.error, null));
        return;
      }
    } else {
      _volume = 0;
    }

    _cancelTrade = false;
    _soldNotifyFunc(this.getInstInfo().result, errHandle(ExError.ok, null));
  }


  this.stopTrade = function() {
    if (_config.errST) return errHandle(ExError.error, null);

    _cancelTrade = true;
    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getInstInfo = function() {
    if (_config.errGII) return errHandle(ExError.error, null);

    return errHandle(ExError.ok, { id: _config.id, type: "ExTestData" });
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.setBoughtNotifyFunc = function(boughtNotifyFunction) {
    if (_config.errSBNF) return errHandle(ExError.error, null);

    _boughtNotifyFunc = boughtNotifyFunction;
    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.setSoldNotifyFunc = function(soldNotifyFunction) {
    if (_config.errSSNF) return errHandle(ExError.error, null);

    _soldNotifyFunc = soldNotifyFunction;
    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getPositions = function() {
    if (_config.errGPO) return errHandle(ExError.error, null);

    return errHandle(ExError.ok, { long: _config.enLong, short: _config.enShort });
  }
}
