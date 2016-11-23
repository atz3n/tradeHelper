/**
 * @description:
 * Emulates a real exchange
 *
 * 
 * @author Atzen
 * @version 0.5.4
 * 
 * CHANGES:
 * 04-Jul-2016 : Initial version
 * 11-Jul-2016 : added throw error system
 * 11-Jul-2016 : added position configuration
 * 22-Jul-2016 : implemented data input
 *                fixed bug: long/short position was not considered while buy/sell function call
 * 22-Jul-2016 : adapted to IExchange v1.1
 * 24-Jul-2016 : adapted to IExchange v1.3
 * 12-Aug-2016 : bugfix: counter now starts with 0 instead of 1
 * 22-Nov-2016 : bugfix: return value from getPrice().result is now last price instead of 0 in finished mode
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
  name: 'undefined',

  priceType: 'sinus', // sinus (sinus shaped price flow), data (uses data array)
  data: '', // data string

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

  /**
   * Indicates first update function call
   * @type {Boolean}
   */
  var firstRun = true;

  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /** 
   * converts data input string to array. 
   * Used seperators: ',', '\n' 
   * @param  {string} data input data 
   * @return {Array}      converted Array 
   */
  var _dataString2Array = function(data) {
    var tmp = data.split(',');
    var tmp2 = [];
    for (var j = 0; j < tmp.length; j++) {
      let tmp3 = tmp[j].split('\n');
      for (var k = 0; k < tmp3.length; k++) tmp2.push(tmp3[k])
    }
    return tmp2;
  }


  /**
   * Checks configuration
   * @return {bool} false if error occurs
   */
  var _checkConfig = function() {
    if (_config.id === 'undefined') return false;
    if (_config.name === 'undefined') return false;

    if (_config.priceType !== 'sinus' && _config.priceType !== 'data') return false;

    if (_config.priceType === 'data') {
      if (typeof _config.data !== 'string') return false;

      var tmp = _dataString2Array(_config.data);
      for (var i = 0; i < tmp.length; i++) {
        if (isNaN(tmp[i])) return false;
      }
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

    if (firstRun) firstRun = false;
    else _counter += _config.stepWidth;

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
    _balance = _config.balanceAmount;
    _dataArray = _dataString2Array(_config.data);

    return errHandle(ExError.ok, null);
  }


  /**
   * Interface function (see IExchange.js for detail informations)
   */
  this.getConfig = function() {
    if (_config.errGC) return errHandle(ExError.error, null);


    var tmpA = [];

    tmpA.push({ title: 'Price Type', value: _config.priceType });

    if (_config.priceType === 'data') {
      var tmpS = '';
      for (var i = 0; i < _dataArray.length; i++) {
        if (i >= 100) { // crop string to max 100 data
          tmpS += '...';
          break;
        }
        if (i > 0) tmpS += ', ';
        tmpS += _dataArray[i];
      }
      tmpA.push({ title: 'data', value: tmpS });
    }

    tmpA.push({ title: 'Start Value', value: _config.startVal });
    tmpA.push({ title: 'Gain', value: _config.gain });
    tmpA.push({ title: 'Offset', value: _config.offset });
    tmpA.push({ title: 'Step Width', value: _config.stepWidth });
    tmpA.push({ title: 'Start Balance', value: _config.balanceAmount });
    tmpA.push({ title: 'Trade Delay [Sec]', value: _config.tradeDelaySec });
    tmpA.push({ title: 'Enabled Long', value: JSON.stringify(_config.enLong) });
    tmpA.push({ title: 'Enabled Short', value: JSON.stringify(_config.enShort) });

    if (Meteor.settings.public.ExTestDataErrorConfig === 'true') {
      tmpA.push({ title: 'Error setConfig()', value: JSON.stringify(_config.errSC) });
      tmpA.push({ title: 'Error getConfig()', value: JSON.stringify(_config.errGC) });
      tmpA.push({ title: 'Error getInfo()', value: JSON.stringify(_config.errGI) });
      tmpA.push({ title: 'Error getPairUnits()', value: JSON.stringify(_config.errGPU) });
      tmpA.push({ title: 'Error getVolume()', value: JSON.stringify(_config.errGV) });
      tmpA.push({ title: 'Error getPrice()', value: JSON.stringify(_config.errGP) });
      tmpA.push({ title: 'Error getTradePrice()', value: JSON.stringify(_config.errGTP) });
      tmpA.push({ title: 'Error update()', value: JSON.stringify(_config.errU) });
      tmpA.push({ title: 'Error sell()', value: JSON.stringify(_config.errS) });
      tmpA.push({ title: 'Error buy()', value: JSON.stringify(_config.errB) });
      tmpA.push({ title: 'Error stopTrade()', value: JSON.stringify(_config.errST) });
      tmpA.push({ title: 'Error getInstInfo()', value: JSON.stringify(_config.errGII) });
      tmpA.push({ title: 'Error getPositions()', value: JSON.stringify(_config.errGPO) });
      tmpA.push({ title: 'Error setBoughtNotifyFunc()', value: JSON.stringify(_config.errSBNF) });
      tmpA.push({ title: 'Error setSoldNotifyFunc()', value: JSON.stringify(_config.errSSNF) });
    }

    return errHandle(ExError.ok, tmpA);
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
        if (_counter < _dataArray.length) {
          price = Math.abs(_config.gain * _dataArray[_counter % _dataArray.length] + _config.offset);
        } else {
          price = Math.abs(_config.gain * _dataArray[_dataArray.length - 1] + _config.offset);
          return errHandle(ExError.finished, price);
        }
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
      if (positon === 'none') {
        _volume = _balance / this.getPrice().result;
        _balance -= _volume * this.getPrice().result;
      } else if (positon === 'short') {
        _balance -= _volume * this.getPrice().result;
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
      if (positon === 'none') {
        _volume = _balance / this.getPrice().result;
        _balance += _volume * this.getPrice().result;
      } else if (positon === 'long') {
        _balance += _volume * this.getPrice().result;
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

    return errHandle(ExError.ok, { id: _config.id, name: _config.name, type: "ExTestData" });
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
