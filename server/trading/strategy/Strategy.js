/**
 * @description:
 * Trading strategy class
 *
 * 
 * This is the central class for each trading strategy.
 * It combines all settings and handles the plugin and exchange interactions
 *
 * 
 * @author Atzen
 * @version 0.1.1
 *
 * 
 * CHANGES:
 * 26-Jul-2016 : Initial version
 * 12-Aug-2016 : bugfix: every plugins start api will be called in first updatFunc call now
 */

import { InstHandler } from '../../lib/InstHandler.js';
import { SchM } from '../../lib/SchM.js';
import { SchMSC } from '../../lib/SchMSC.js';


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

/***********************************************************************
  Public Static Variable
 ***********************************************************************/

/**
 * Strategy Error object
 * @type {Object}
 */
StrError = {
  ok: 'OK',
  ExConfigError: 'EXCHANGE_CONFIG_ERROR',
  PlConfigError: 'PLUGIN_CONFIG_ERROR',
  error: 'ERROR',
  notFound: 'STRATEGY_NOT_FOUND',
  errCode: 'ERROR_CODE'
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

/**
 * Strategy class
 * @param {Object} strategyDescription object which contains all necessary strategy informations
 * @param {function} createPluginFunc    callback function which will be called to create an plugin instance
 * @param {function} createExchangeFunc  callback function which will be called to create an exchange instance
 */
export function Strategy(strategyDescription, createPluginFunc, createExchangeFunc) {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  /**
   * Object that contains all configurations
   * @type {Object}
   */
  var _strDesc = {};

  /**
   * Plugins handler
   * @type {InstHandler}
   */
  var _plugins = new InstHandler();

  /**
   * Exchanges handler
   * @type {InstHandler}
   */
  var _exchanges = new InstHandler();

  /**
   * Mask for none action (used for buy/sell validation)
   * @type {Number}
   */
  var _noneMask = 1; //none: 1

  /**
   * Mask for buy action (used for buy/sell validation)
   * @type {Number}
   */
  var _buyMask = 2; //buy: 1 << 1 (2)

  /**
   * Mask for sell action (used for buy/sell validation)
   * @type {Number}
   */
  var _sellMask = 4; //sell: 1 << 2 (4)

  /**
   * Holds masks for validations
   * @type {Array}
   */
  var _notifyMaskedValues = new Array();

  /**
   * Callback function that will be called if a buy/sell action should be done
   */
  var _notifyFunc = function() {};

  /**
   * Callback function that will be called if an error occurred
   */
  var _errorFunc = function() {};

  /**
   * Holds following exchange depending informations:
   * trading: bool that indicates whether an exchange is still trading or not
   * error: bool that indicates an error while trading
   * @type {Array}
   */
  var _exTrading = [];

  /**
   * Holds the last position (updated every _updateFunc call)
   * Used to create a history from each trade
   * @type {String}
   */
  var _lastPosition = 'none';

  /**
   * Used for error handling while constructor function is running
   * @type {error Object}
   */
  var _constrError = errHandle(StrError.ok, null);

  /**
   * Sets the number of chart data that will be shown in actives details view
   * @type {Number}
   */
  var _numOfChartData = 60;

  /**
   * Holds relevant trade data
   * @type {Object}
   */
  var _data = {
    strategyId: '',
    strategyName: '',
    state: 'out',
    position: 'none',
    plugins: [],
    exchanges: [],
    bundles: [],
    curTime: [],
    inTime: '',
    outTime: ''
  };

  /**
   * Indicates if the notification function should be called
   * @type {Boolean}
   */
  var _callNotifyFunc = false;

  /**
   * Used for first run (update) handling
   * @type {Boolean}
   */
  var _firstRun = false;

  /**
   * Indicates if the _updateFunc function is running
   * Used for synchronous call management
   * @type {Boolean}
   */
  var _updateRunning = false;


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /**
   * Update function which handles the updates from Plugins, Exchanges,
   * datas and histories
   * @param  {bool} fullUpdate indicates a full update (including exchange and plugin updates)
   */
  var _updateFunc = function(fullUpdate) {

    /* check if all exchanges are ready for an update (not currently trading) */
    if (_checkExsNotInTrade()) {

      _callNotifyFunc = false;


      /* prepare variables for full update */
      if (fullUpdate) {

        _clearNotifyValues();

        if (_data.curTime.length >= _numOfChartData) _data.curTime.shift();
        _data.curTime.push(new Date);
      }


      for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
        var ex = _exchanges.getObjectByIdx(i);


        /* update each exchange */
        if (fullUpdate) {
          if (ex.update().error !== ExError.ok) {

            /* error handling */
            var instInfo = ex.getInstInfo();

            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x004', strId: _strDesc._id, name: instInfo.result.name }));
            }
          }


          /* update _data.price array */
          if (_data.exchanges[i].price.length >= _numOfChartData) _data.exchanges[i].price.shift();

          var pEx = ex.getPrice();

          /* error handling */
          if (pEx.error !== ExError.ok) {

            var instInfo = ex.getInstInfo();

            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              if (pEx.error === ExError.finished) {
                _errorFunc(_strDesc._id, errorMessage({ code: '0x011', strId: _strDesc._id, name: instInfo.result.name }));
              } else {
                _errorFunc(_strDesc._id, errorMessage({ code: '0x002', strId: _strDesc._id, name: instInfo.result.name }));
              }
            }

            /* if an error occurs, set price to last price (0 if it's the first array element) */
            if (_data.exchanges[i].price.length === 0) pEx.result = 0;
            else pEx.result = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
          }

          _data.exchanges[i].price.push(pEx.result);
        }


        /* update exchange infos */
        var iEx = ex.getInfo();

        /* error handling */
        if (iEx.error !== ExError.ok) {

          var instInfo = ex.getInstInfo();

          if (instInfo.error !== ExError.ok) {
            _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
          } else {
            _errorFunc(_strDesc._id, errorMessage({ code: '0x003', strId: _strDesc._id, name: instInfo.result.name }));
          }

          iEx.result = [];
        }
        _data.exchanges[i].info = iEx;

      }


      var numOfPl = _plugins.getObjectsArray().length;
      for (var i = 0; i < numOfPl; i++) {
        var pl = _plugins.getObjectByIdx(i);


        /* update each plugin */
        if (fullUpdate) {
          var eIdx = _exchanges.getObjectIdx(pl.exId);
          var price = _data.exchanges[eIdx].price[_data.exchanges[eIdx].price.length - 1];

          if (_firstRun) pl.inst.start(price);
          else pl.inst.update(price);
        }

        _data.plugins[i].state = pl.inst.getState();
        _data.plugins[i].info = pl.inst.getInfo();

        if(i === numOfPl - 1) _firstRun = false;
      }


      /* evaluate notification values */
      if (fullUpdate) _evalNotifyValues();


      /* update activeData db */
      _updateActiveData();


      /* call notification function */
      if (_callNotifyFunc) {
        _notifyFunc(notifyParam);
      }


      /* update history after a successfully trade (in + out) */
      if (_lastPosition !== 'none' && _data.position === 'none') {
        _updateHistory();
      }

      _lastPosition = _data.position;
    }
  }


  /**
   * Updates ActiveDatas db document
   */
  var _updateActiveData = function() {

    if (typeof ActiveDatas.findOne({ strategyId: _data.strategyId }) === 'undefined') {
      ActiveDatas.insert(_data);
    } else {
      ActiveDatas.update({ strategyId: _data.strategyId }, { $set: _data });
    }
  }


  /**
   * Updates Histories db
   */
  var _updateHistory = function() {
    var tmp = {};


    tmp.inTime = _data.inTime;
    tmp.outTime = _data.outTime;
    tmp.strategyId = _data.strategyId;
    tmp.ownerId = _data.ownerId;
    tmp.strategyName = _data.strategyName;
    tmp.position = _lastPosition;
    tmp.bundles = JSON.parse(JSON.stringify(_data.bundles));

    tmp.strConfig = {
      updateTime: _strDesc.updateTime,
      timeUnit: _strDesc.timeUnit,
      mode: _strDesc.mode
    };

    tmp.plugins = [];
    for (i in _data.plugins) {
      tmp.plugins[i] = {};
      tmp.plugins[i].name = _data.plugins[i].name;
      tmp.plugins[i].instInfo = _data.plugins[i].instInfo;
      tmp.plugins[i].config = _plugins.getObject(tmp.plugins[i].instInfo.id).inst.getConfig();
    }

    tmp.exchanges = [];
    for (i in _data.exchanges) {
      tmp.exchanges[i] = {};
      tmp.exchanges[i].name = _data.exchanges[i].name;
      tmp.exchanges[i].instInfo = _data.exchanges[i].instInfo;
      tmp.exchanges[i].units = _data.exchanges[i].units;
      tmp.exchanges[i].inPrice = _data.exchanges[i].inPrice;
      tmp.exchanges[i].inTime = _data.exchanges[i].inTime;
      tmp.exchanges[i].outPrice = _data.exchanges[i].outPrice;
      tmp.exchanges[i].outTime = _data.exchanges[i].outTime;
      tmp.exchanges[i].volume = _data.exchanges[i].volume;


      var ret = _exchanges.getObject(tmp.exchanges[i].instInfo.id).getConfig();

      /* error handling */
      if (ret.error !== ExError.ok) {
        _errorFunc(_strDesc._id, errorMessage({ code: '0x001', strId: _strDesc._id, name: tmp.exchanges[i].instInfo.name }));
        ret = {};
      }

      tmp.exchanges[i].config = ret;
    }

    tmp.activeId = ActiveDatas.findOne({ strategyId: _data.strategyId })._id;
    Histories.insert(tmp);
  }


  /**
   * Sets plugin depending buy notification value in _notifyMaskedValues Array
   * @param  {object} instInfo return object from IPlugin.getInstInfo() function
   */
  var _buyNotification = function(instInfo) {
    for (var i = 0; i < _notifyMaskedValues.length; i++) {
      if (_notifyMaskedValues[i].getObject(instInfo.id) !== 'undefined') {
        _notifyMaskedValues[i].setObject(instInfo.id, _buyMask);
      }
    }
  }


  /**
   * Sets plugin depending sell notification value in _notifyMaskedValues Array
   * @param  {object} instInfo return object from IPlugin.getInstInfo() function
   */
  var _sellNotification = function(instInfo) {
    for (var i = 0; i < _notifyMaskedValues.length; i++) {
      if (_notifyMaskedValues[i].getObject(instInfo.id) !== 'undefined') {
        _notifyMaskedValues[i].setObject(instInfo.id, _sellMask);
      }
    }
  }


  /**
   * Evaluates _notifyMaskedValues Array
   */
  var _evalNotifyValues = function() {
    var finalDecision = 0;
    var pluginBundleVals = new Array(_notifyMaskedValues.length);
    pluginBundleVals.fill(0);


    for (var i = 0; i < _notifyMaskedValues.length; i++) {

      /* shrink 'and' connected plugins */
      for (var j = 0; j < _notifyMaskedValues[i].getObjectsArray().length; j++) {
        pluginBundleVals[i] |= _notifyMaskedValues[i].getObjectByIdx(j);
      }

      if (pluginBundleVals[i] !== _buyMask && pluginBundleVals[i] !== _sellMask) {
        pluginBundleVals[i] = _noneMask;
      }

      /* get final decision */
      finalDecision |= pluginBundleVals[i];

    }


    /* evaluate final decision */
    if (finalDecision < (_buyMask + _sellMask) && // buy + sell notification is not valid
      finalDecision > _noneMask) { // only none means no notification needed


      /* eliminate none flag */
      finalDecision &= ~_noneMask;


      /* set notify function parameter */
      notifyParam = {
        strategyId: _strDesc._id,
        action: 'none'
      };


      /* evaluated buy */
      if (finalDecision === _buyMask) {
        notifyParam.action = 'buy';
        _callNotifyFunc = true;

        _data.state = 'buy request';

        /* buy */
        if (_strDesc.mode === 'auto' || (_strDesc.mode === 'semiAuto' && _data.position === 'short')) {
          _tradeFunction('buy');
        }
      }


      /* evaluated sell */
      if (finalDecision === _sellMask) {
        notifyParam.action = 'sell';
        _callNotifyFunc = true;

        _data.state = 'sell request';

        /* sell */
        if (_strDesc.mode === 'auto' || (_strDesc.mode === 'semiAuto' && _data.position === 'long')) {
          _tradeFunction('sell');
        }
      }
    }
  }


  /**
   * Initiates a trade
   * @param  {String} trade sets buy ('buy') or sell ('sell') trade
   */
  var _tradeFunction = function(trade) {
    if ((_data.position !== 'long' && trade === 'buy') ||
      (_data.position !== 'short' && trade === 'sell')) {

      /* update state */
      if (trade === 'buy') _data.state = 'buying';
      if (trade === 'sell') _data.state = 'selling';
      _updateActiveData();


      /* set trading state */
      for (i in _exTrading) _exTrading[i].trading = true;


      /* reset error state */
      if (_data.position === 'none') {
        for (i in _exTrading) _exTrading[i].error = false;
      }


      /* call exchanges trade function */
      for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
        var tmp = _exchanges.getObjectByIdx(i);

        if (_exTrading[i].error) _exTrading[i].trading = false;
        else if (trade === 'buy') tmp.buy(_data.position);
        else if (trade === 'sell') tmp.sell(_data.position);
      }
    }
  }


  /**
   * IExchanges boughtNotifyFunction
   */
  var _exBoughtNotifyFunc = function(instInfo, errObject) {
    _postTradingCheck('buy', instInfo, errObject);
  }


  /**
   * IExchanges soldNotifyFunction
   */
  var _exSoldNotifyFunc = function(instInfo, errObject) {
    _postTradingCheck('sell', instInfo, errObject);
  }


  /**
   * Executes some post trading checks and initiates the trading post process
   * @param  {String} trade     indicates a buy ('buy') or sell ('sell') trade
   * @param  {Object} instInfo  IExchanges boughtNotifyFunction/sellNotifyFunction parameter
   * @param  {Object} errObject IExchanges boughtNotifyFunction/sellNotifyFunction parameter
   */
  var _postTradingCheck = function(trade, instInfo, errObject) {
    var idx = _exchanges.getObjectIdx(instInfo.id);


    /* reset trading state */
    _exTrading[idx].trading = false;


    /* check if an error occurred */
    if (errObject.error != ExError.ok) {
      if (trade === 'buy') _errorFunc(_strDesc._id, errorMessage({ code: '0x00B', strId: _strDesc._id, name: instInfo.name }));
      if (trade === 'sell') _errorFunc(_strDesc._id, errorMessage({ code: '0x00C', strId: _strDesc._id, name: instInfo.name }));
      return _exTrading[idx].error = true;
    }


    /* start the trading post process after all exchanges finished trading */
    if (_checkExsNotInTrade()) {
      if (_checkAtLstOneExNotErr()) {
        if (trade === 'buy') _tradingPostProcessing('buy');
        if (trade === 'sell') _tradingPostProcessing('sell');
      } else {
        _data.state === 'error';
        _syncUpdateFuncCall(false);
      }
    }
  }


  /**
   * Does some post trading handles
   * @param  {String} trade indicates a buy ('buy') or sell ('sell') trade
   */
  var _tradingPostProcessing = function(trade) {

    /* set trades out position */
    var posOut = '';
    if (trade === 'buy') posOut = 'short';
    if (trade === 'sell') posOut = 'long';


    /* set time data */
    if (_data.position === 'none') _data.inTime = new Date();
    if (_data.position === posOut) _data.outTime = new Date();


    /* exchanges processing */
    for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
      var ex = _exchanges.getObjectByIdx(i);


      /* exchanges in position handling */
      if (_data.position === 'none') {

        /* error handling */
        if (_exTrading[i].error) {
          _data.exchanges[i].inPrice = _data.exchanges[i].price[_data.exchanges[i].price.length - 1]; // set in price to last price
          _data.exchanges[i].volume = 0;
        } else {


          /* get in price */
          var tPrice = ex.getTradePrice();

          /* error handling */
          if (tPrice.error !== ExError.ok) {

            var instInfo = ex.getInstInfo();

            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x007', strId: _strDesc._id, name: instInfo.result.name }));
            }

            tPrice.result = _data.exchanges[i].price[_data.exchanges[i].price.length - 1]; // set in price to last price
          }

          /* save in price */
          _data.exchanges[i].inPrice = tPrice.result;


          /* get volume */
          var vTmp = ex.getVolume();

          /* error handling */
          if (vTmp.error !== ExError.ok) {

            var instInfo = ex.getInstInfo();

            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x008', strId: _strDesc._id, name: instInfo.result.name }));
            }

            vTmp.result = 0;
          }

          /* save volume */
          _data.exchanges[i].volume = vTmp.result;
        }
      }


      /* exchanges out position handling */
      if (_data.position === posOut) {

        /* error handling */
        if (_exTrading[i].error) {
          _data.exchanges[i].outPrice = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
        } else {


          /* get out price */
          var tPrice = ex.getTradePrice();

          /* error handling */
          if (tPrice.error !== ExError.ok) {

            var instInfo = ex.getInstInfo();

            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x007', strId: _strDesc._id, name: instInfo.result.name }));
            }

            tPrice.result = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
          }

          /* save out price */
          _data.exchanges[i].outPrice = tPrice.result;
        }
      }
    }


    /* plugins processing */
    for (var i = 0; i < _plugins.getObjectsArray().length; i++) {
      var pl = _plugins.getObjectByIdx(i);
      var exIdx = _exchanges.getObjectIdx(pl.exId);


      /* error handling */
      if (_exTrading[exIdx].error) {
        if (trade === 'buy') pl.inst.bought(_data.exchanges[exIdx].price[_data.exchanges[exIdx].price.length - 1]);
        if (trade === 'sell') pl.inst.sold(_data.exchanges[exIdx].price[_data.exchanges[exIdx].price.length - 1]);
      } else {


        /* get trade price */
        var tPrice = _exchanges.getObject(pl.exId).getTradePrice();

        /* error handling */
        if (tPrice.error !== ExError.ok) {
          var instInfo = _exchanges.getObject(pl.exId).getInstInfo();

          if (instInfo.error !== ExError.ok) {
            _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
          } else {
            _errorFunc(_strDesc._id, errorMessage({ code: '0x007', strId: _strDesc._id, name: instInfo.result.name }));
          }

          tPrice.result = _data.exchanges[exIdx].price[_data.exchanges[exIdx].price.length - 1];
        }


        /* call trade finished function */
        if (trade === 'buy') pl.inst.bought(tPrice.result);
        if (trade === 'sell') pl.inst.sold(tPrice.result);
      }
    }


    /* set new state and position */
    if (_data.position === 'none') {
      if (trade === 'buy') _data.position = 'long';
      if (trade === 'sell') _data.position = 'short';
      _data.state = 'in';
    } else if (_data.position === 'short' || _data.position == 'long') {
      _data.position = 'none';
      _data.state = 'out';
    }


    /* call update function */
    _syncUpdateFuncCall(false);
  }


  /**
   * Manages synchronous _updateFunc() calls
   * @param  {bool} fullUpdate _updateFunc parameter
   */
  var _syncUpdateFuncCall = function(fullUpdate) {

    /* wait until _updateFunc is released / not running */
    while (_updateRunning) Meteor._sleepForMs(1);

    _updateRunning = true;
    _updateFunc(fullUpdate);
    _updateRunning = false;
  }


  /**
   * Transforms an error object into an error message 
   * @param  {Object} errObj error Object
   * @return {Object}        an errHandle object containing the error message
   */
  var errorMessage = function(errObj) {

    var erPreMsg = 'AN ERROR OCCURRED IN STRATEGY "' + _strDesc.name + '":' + '\n';
    var infPreMsg = 'AN INFO FROM STRATEGY "' + _strDesc.name + '":' + '\n';


    if (errObj.code === '0x000') {
      return errHandle(StrError.error, erPreMsg + 'Configuration of Exchange "' + errObj.name + '" could not be set!');
    }

    if (errObj.code === '0x001') {
      return errHandle(StrError.error, erPreMsg + 'Configuration of Exchange "' + errObj.name + '" could not be fetched!');
    }

    if (errObj.code === '0x002') {
      return errHandle(StrError.error, erPreMsg + 'Current price from Exchange "' + errObj.name + '" could not be fetched!');
    }

    if (errObj.code === '0x003') {
      return errHandle(StrError.error, erPreMsg + 'Additional informations of Exchange "' + errObj.name + '" could not be fetched!');
    }

    if (errObj.code === '0x004') {
      return errHandle(StrError.error, erPreMsg + 'Current Price from Exchange "' + errObj.name + '" could not be updated!');
    }

    if (errObj.code === '0x005') {
      return errHandle(StrError.error, erPreMsg + 'Instance informations from an Exchange could not be fetched!');
    }

    if (errObj.code === '0x006') {
      return errHandle(StrError.error, erPreMsg + 'Trade pair units from Exchange "' + errObj.name + '" could not be fetched!');
    }

    if (errObj.code === '0x007') {
      return errHandle(StrError.error, erPreMsg + 'Trade price from Exchange "' + errObj.name + '" could not be fetched!');
    }

    if (errObj.code === '0x008') {
      return errHandle(StrError.error, erPreMsg + 'Trade volume from Exchange "' + errObj.name + '" could not be fetched!');
    }

    if (errObj.code === '0x009') {
      return errHandle(StrError.error, erPreMsg + 'Bought notify function from Exchange "' + errObj.name + '" could not be set!');
    }

    if (errObj.code === '0x00A') {
      return errHandle(StrError.error, erPreMsg + 'Sold notify function from Exchange "' + errObj.name + '" could not be set!');
    }

    if (errObj.code === '0x00B') {
      return errHandle(StrError.error, erPreMsg + 'Something went wrong while buying at Exchange "' + errObj.name + '"');
    }

    if (errObj.code === '0x00C') {
      return errHandle(StrError.error, erPreMsg + 'Something went wrong while selling at Exchange "' + errObj.name + '"');
    }

    if (errObj.code === '0x00D') {
      return errHandle(StrError.error, erPreMsg + 'Something went wrong while stopping a trade from Exchange "' + errObj.name + '"');
    }

    if (errObj.code === '0x00E') {
      return errHandle(StrError.error, erPreMsg + 'Available  position informations of Exchange "' + errObj.name + '" could not be fetched!');
    }

    if (errObj.code === '0x00F') {
      return errHandle(StrError.error, erPreMsg + 'Exchange "' + errObj.name + '" does not support long position trading. Change Exchange depending plugin configurations');
    }

    if (errObj.code === '0x010') {
      return errHandle(StrError.error, erPreMsg + 'Exchange "' + errObj.name + '" does not support short position trading. Change Exchange depending plugin configurations');
    }

    if (errObj.code === '0x011') {
      return errHandle(ExError.finished, infPreMsg + 'Exchange "' + errObj.name + '" finished');
    }

    if (errObj.code === '0x012') {
      return errHandle(ExError.error, erPreMsg + 'Configuration of Plugin "' + errObj.name + '" could not be set!');
    }
  }


  /**
   * Indicates if an exchange is currently trading
   * @return {bool} true if an exchange is currently trading
   */
  var _checkExsNotInTrade = function() {
    for (i in _exTrading) {
      if (_exTrading[i].trading) return false;
    }

    return true;
  }


  /**
   * Checks if at least one exchange traded successfully
   * @return {bool} true if at least one exchange traded successfully
   */
  var _checkAtLstOneExNotErr = function() {
    for (i in _exTrading) {
      if (!_exTrading[i].error) return true;
    }

    return false;
  }


  /**
   * Resets the _notifyMaskedValues
   */
  var _clearNotifyValues = function() {
    for (var i = 0; i < _notifyMaskedValues.length; i++) {
      for (var j = 0; j < _notifyMaskedValues[i].getObjectsArray().length; j++) {
        _notifyMaskedValues[i].setObjectByIdx(j, _noneMask);
      }
    }
  }


  /**
   * Calculates the update time for SchM schedules 
   * @return {Number} update time in seconds
   */
  var _calcSchMUpdateTime = function() {
    var unit2Sec = 60; // 1 min

    if (_strDesc.timeUnit === 'seconds') unit2Sec = 1;
    if (_strDesc.timeUnit === 'minutes') unit2Sec = 1 * 60;
    if (_strDesc.timeUnit === 'hours') unit2Sec = 1 * 60 * 60;
    if (_strDesc.timeUnit === 'day') unit2Sec = 1 * 60 * 60 * 24;

    return _strDesc.updateTime * unit2Sec;
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  /**
   * Sets the notification callback function
   * @param {function} notifyFunction notification function with parameter {strategyId: <strategy id>, action: <buy/sell>}
   */
  this.setNotifyFunction = function(notifyFunction) {
    _notifyFunc = notifyFunction;
  }


  /**
   * Sets the error callback function
   * @param {function} errorFunction error function with parameters strategyId: <strategy Id>, errObj: <errHandle Object>
   */
  this.setErrorFunction = function(errorFunction) {
    _errorFunc = errorFunction;
  }


  /**
   * Starts the Strategy
   */
  this.start = function() {
    _firstRun = true;


    if (_strDesc.timeUnit !== 'none') {

      /* select the Scheduler and start an schedule */
      if (_strDesc.timeUnit === 'seconds' || _strDesc.timeUnit === 'minutes' ||
        _strDesc.timeUnit === 'hours' || _strDesc.timeUnit === 'days') {
        SchM.createSchedule(_strDesc._id, _calcSchMUpdateTime(), _syncUpdateFuncCall, true);
      } else {
        SchMSC.createSchedule(_strDesc._id, 'every ' + _strDesc.updateTime + ' ' + _strDesc.timeUnit, _syncUpdateFuncCall, true);
      }

    }

    _syncUpdateFuncCall(true);
  }


  /**
   * Restarts the Strategy after pause
   */
  this.resume = function() {

    if (_strDesc.timeUnit !== 'none') {

      /* select the Scheduler and start an schedule */
      if (_strDesc.timeUnit === 'seconds' || _strDesc.timeUnit === 'minutes' ||
        _strDesc.timeUnit === 'hours' || _strDesc.timeUnit === 'days') {
        SchM.restartSchedule(_strDesc._id)
      } else {
        SchMSC.restartSchedule(_strDesc._id)
      }

    }

    _syncUpdateFuncCall(true);
  }


  /**
   * Stops the Strategy
   */
  this.stop = function() {

    if (_strDesc.timeUnit !== 'none') {

      /* select the Scheduler and remove the corresponding strategy schedule */
      if (_strDesc.timeUnit === 'seconds' || _strDesc.timeUnit === 'minutes' ||
        _strDesc.timeUnit === 'hours' || _strDesc.timeUnit === 'days') {
        SchM.removeSchedule(_strDesc._id)
      } else {
        SchMSC.removeSchedule(_strDesc._id)
      }

    }
  }


  /**
   * Pause the Strategy
   */
  this.pause = function() {

    if (_strDesc.timeUnit !== 'none') {

      /* select the Scheduler and stop the corresponding strategy schedule */
      if (_strDesc.timeUnit === 'seconds' || _strDesc.timeUnit === 'minutes' ||
        _strDesc.timeUnit === 'hours' || _strDesc.timeUnit === 'days') {
        SchM.stopSchedule(_strDesc._id)
      } else {
        SchMSC.stopSchedule(_strDesc._id)
      }

    }
  }


  /**
   * Cancels running trades
   */
  this.stopTrading = function() {
    if (!_checkExsNotInTrade()) {
      for (i in _exTrading) {
        if (_exTrading[i].trading) {
          if (_exchanges.getObjectByIdx(i).stopTrade().error !== ExError.ok) {
            var instInfo = _exchanges.getObjectByIdx(i).getInstInfo();

            /* error handling */
            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x00D', strId: _strDesc._id, name: instInfo.result.name }));
            }
          }
        }
      }
    }
  }


  /**
   * Refreshes the Strategy
   */
  this.refresh = function() {
    _syncUpdateFuncCall(true);
  }


  /**
   * Initiates a buy action
   */
  this.buy = function() {
    if (_data.state !== 'buying' && _data.state !== 'selling') {
      _tradeFunction('buy');
    }
  }


  /**
   * Initiates a sell action
   */
  this.sell = function() {
    if (_data.state !== 'buying' && _data.state !== 'selling') {
      _tradeFunction('sell')
    }
  }


  /**
   * Returns the Status after _constructor call
   * Used to indicate an error inside the constructor function
   * @return {Object} errHandle object
   */
  this.getStatus = function() {
    return _constrError;
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/

  /**
   * Constructor function
   * @param  {Object} strDesc      classes strategyDescription parameter 
   * @param  {function} createPlFunc classes createPluginFunc parameter
   * @param  {function} createExFunc classes createExchangeFunc parameter
   */
  var _constructor = function(strDesc, createPlFunc, createExFunc) {
    var plCnt = 0;
    var exCnt = 0;
    _strDesc = Object.assign({}, strDesc);

    _data.strategyId = _strDesc._id;
    _data.ownerId = Strategies.findOne({ _id: _data.strategyId }).ownerId;
    _data.strategyName = _strDesc.name;
    _data.bundles = new Array(_strDesc.pluginBundles.length);


    /* create plugin and exchange instances */
    for (var i = 0; i < _strDesc.pluginBundles.length; i++) {

      _data.bundles[i] = {};
      _data.bundles[i].name = _strDesc.pluginBundles[i].name;
      _data.bundles[i].plugins = new Array(_strDesc.pluginBundles[i].bundlePlugins.length);


      /* create notify handler to emulate plugin structure */
      _notifyMaskedValues[i] = new InstHandler();

      for (var j = 0; j < _strDesc.pluginBundles[i].bundlePlugins.length; j++) {
        var plugin = _strDesc.pluginBundles[i].bundlePlugins[j];

        /* add plugin id for evaluation */
        _notifyMaskedValues[i].setObject(plugin._id, _noneMask);


        _data.bundles[i].plugins[j] = { "pId": plugin._id, "eId": plugin.exchange._id };


        /* create not yet created plugin instances */
        if (_plugins.getObject(plugin._id) === 'undefined') {


          /* Plugin Creation Function */
          if (!createPlFunc(plugin, _plugins)) {
            return _constrError = errorMessage({ code: '0x012', strId: _strDesc._id, name: plugin.name });
          }

          var pl = _plugins.getObject(plugin._id).inst;
          pl.setBuyNotifyFunc(_buyNotification);
          pl.setSellNotifyFunc(_sellNotification);


          /* initialize plugin elements of data information variable */
          _data.plugins[plCnt] = {};
          _data.plugins[plCnt].name = plugin.name;
          _data.plugins[plCnt].instInfo = pl.getInstInfo();
          plCnt++;


          /* create not yet created exchange instances */
          if (_exchanges.getObject(plugin.exchange._id) === 'undefined') {


            /* Exchange Creation Function */
            if (!createExFunc(plugin.exchange, _exchanges)) {
              return _constrError = errorMessage({ code: '0x000', strId: _strDesc._id, name: plugin.exchange.name });
            }


            /* check if position configuration works */
            var plPositions = _plugins.getObject(plugin._id).inst.getPositions();
            var exPositions = _exchanges.getObject(plugin.exchange._id).getPositions();
            if (exPositions.error !== ExError.ok) return _constrError = errorMessage({ code: '0x00E', strId: _strDesc._id, name: plugin.exchange.name });

            if (plPositions.long) {
              if (!exPositions.result.long) return _constrError = errorMessage({ code: '0x00F', strId: _strDesc._id, name: plugin.exchange.name });
            }

            if (plPositions.short) {
              if (!exPositions.result.short) return _constrError = errorMessage({ code: '0x010', strId: _strDesc._id, name: plugin.exchange.name });
            }


            /* set notify functions */
            if (_exchanges.getObject(plugin.exchange._id).setBoughtNotifyFunc(_exBoughtNotifyFunc).error !== ExError.ok) {
              return _constrError = errorMessage({ code: '0x009', strId: _strDesc._id, name: plugin.exchange.name });
            }

            if (_exchanges.getObject(plugin.exchange._id).setSoldNotifyFunc(_exSoldNotifyFunc).error !== ExError.ok) {
              return _constrError = errorMessage({ code: '0x00A', strId: _strDesc._id, name: plugin.exchange.name });
            }

            _exTrading.push({ trading: false, error: false });


            /* initialize exchange elements of data information variable */
            var ex = _exchanges.getObject(plugin.exchange._id);
            _data.exchanges[exCnt] = {};
            _data.exchanges[exCnt].price = [];
            _data.exchanges[exCnt].name = plugin.exchange.name;

            var iTmp = ex.getInstInfo();
            if (iTmp.error !== ExError.ok) return _constrError = errorMessage({ code: '0x005', strId: _strDesc._id });
            _data.exchanges[exCnt].instInfo = iTmp.result;

            var pTmp = ex.getPairUnits();
            if (pTmp.error !== ExError.ok) return _constrError = errorMessage({ code: '0x006', strId: _strDesc._id, name: plugin.exchange.name });
            _data.exchanges[exCnt].units = pTmp.result;

            exCnt++;
          }
        }
      }
    }
  }

  /* constructor call */
  _constructor(strategyDescription, createPluginFunc, createExchangeFunc)
}
