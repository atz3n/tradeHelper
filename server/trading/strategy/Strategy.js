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


import { InstHandler } from '../../lib/InstHandler.js';
import { PlSwing } from '../plugins/PlSwing.js';
import { ExKraken } from '../exchanges/ExKraken.js';
import { ExTestData } from '../exchanges/ExTestData.js';
import { SchM } from '../../lib/SchM.js';
import { SchMSC } from '../../lib/SchMSC.js';


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

/***********************************************************************
  Public Static Variable
 ***********************************************************************/

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

export function Strategy(strategyDescription) {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  var _strDesc = '';
  var _plugins = new InstHandler();
  var _exchanges = new InstHandler();

  var _noneMask = 1; //none: 1
  var _buyMask = 2; //buy: 1 << 1 (2)
  var _sellMask = 4; //sell: 1 << 2 (4)
  var _notifyMaskedValues = new Array();

  var _notifyFunc = function() {};
  var _errorFunc = function() {};

  var _exTrading = [];

  var _lastPosition = 'none';

  var _constrError = errHandle(StrError.ok, null);

  var _numOfChartData = 60;
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

  var _notifyParam = {};
  var _callNotifyFunc = false;

  var _firstRun = false;


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  var _updateFunc = function(fullUpdate) {
    if (_checkExsNotInTrade()) {

      _callNotifyFunc = false;


      if (fullUpdate) {

        _clearNotifyValues();

        if (_data.curTime.length >= _numOfChartData) _data.curTime.shift();
        _data.curTime.push(new Date);
      }

      for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
        var tmp = _exchanges.getObjectByIdx(i);

        if (fullUpdate) {
          if (tmp.update().error !== ExError.ok) {

            var instInfo = tmp.getInstInfo();

            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x004', strId: _strDesc._id, name: instInfo.result.name }));
            }
          }

          if (_data.exchanges[i].price.length >= _numOfChartData) _data.exchanges[i].price.shift();

          var pTmp = tmp.getPrice();
          if (pTmp.error !== ExError.ok) {

            var instInfo = tmp.getInstInfo();

            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              if (pTmp.error === ExError.finished) {
                _errorFunc(_strDesc._id, errorMessage({ code: '0x011', strId: _strDesc._id, name: instInfo.result.name }));
              } else {
                _errorFunc(_strDesc._id, errorMessage({ code: '0x002', strId: _strDesc._id, name: instInfo.result.name }));
              }
            }

            if (_data.exchanges[i].price.length === 0) pTmp.result = 0;
            else pTmp.result = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
          }

          _data.exchanges[i].price.push(pTmp.result);
        }


        var iTmp = tmp.getInfo();
        if (iTmp.error !== ExError.ok) {

          var instInfo = tmp.getInstInfo();

          if (instInfo.error !== ExError.ok) {
            _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
          } else {
            _errorFunc(_strDesc._id, errorMessage({ code: '0x003', strId: _strDesc._id, name: instInfo.result.name }));
          }

          iTmp.result = [];
        }
        _data.exchanges[i].info = iTmp;
      }


      for (var i = 0; i < _plugins.getObjectsArray().length; i++) {
        var tmp = _plugins.getObjectByIdx(i);

        if (fullUpdate) {
          var eIdx = _exchanges.getObjectIdx(tmp.exId);
          var price = _data.exchanges[eIdx].price[_data.exchanges[eIdx].price.length - 1];

          if (_firstRun) {
            _firstRun = false;
            tmp.inst.start(price);
          } else {
            tmp.inst.update(price);
          }
        }

        _data.plugins[i].state = tmp.inst.getState();
        _data.plugins[i].info = tmp.inst.getInfo();
      }

      if (fullUpdate) _evalNotifyValues();

      _updateActiveData();

      if (_callNotifyFunc) {
        _notifyFunc(notifyParam);
      }

      if (_lastPosition !== 'none' && _data.position === 'none') {
        _updateHistory();
      }

      _lastPosition = _data.position;
    }
  }


  var _updateActiveData = function() {

    if (typeof ActiveDatas.findOne({ strategyId: _data.strategyId }) === 'undefined') {
      ActiveDatas.insert(_data);
    } else {
      ActiveDatas.update({ strategyId: _data.strategyId }, { $set: _data });
    }
  }


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
      if (ret.error !== ExError.ok) {
        _errorFunc(_strDesc._id, errorMessage({ code: '0x001', strId: _strDesc._id, name: tmp.exchanges[i].instInfo.name }));
        ret = {};
      }

      tmp.exchanges[i].config = ret;
    }

    Histories.insert(tmp);
  }


  var _buyNotification = function(instInfo) {
    for (var i = 0; i < _notifyMaskedValues.length; i++) {
      if (_notifyMaskedValues[i].getObject(instInfo.id) !== 'undefined') {
        _notifyMaskedValues[i].setObject(instInfo.id, _buyMask);
      }
    }
  }


  var _sellNotification = function(instInfo) {
    for (var i = 0; i < _notifyMaskedValues.length; i++) {
      if (_notifyMaskedValues[i].getObject(instInfo.id) !== 'undefined') {
        _notifyMaskedValues[i].setObject(instInfo.id, _sellMask);
      }
    }
  }


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

      /* buy */
      if (finalDecision === _buyMask) {
        notifyParam.action = 'buy';
        _callNotifyFunc = true;

        _data.state = 'buy request';

        if (_strDesc.mode === 'auto' || (_strDesc.mode === 'semiAuto' && _data.position === 'short')) {
          _buyFunction();
        }
      }

      /* sell */
      if (finalDecision === _sellMask) {
        notifyParam.action = 'sell';
        _callNotifyFunc = true;

        _data.state = 'sell request';

        if (_strDesc.mode === 'auto' || (_strDesc.mode === 'semiAuto' && _data.position === 'long')) {
          _sellFunction();
        }
      }
    }
  }


  var _buyFunction = function() {
    // console.log('buying');
    if (_data.position !== 'long') {
      _data.state = 'buying';
      _updateActiveData();
      // _updateFunc(false);

      for (i in _exTrading) _exTrading[i].trading = true;

      if (_data.position === 'none') {
        for (i in _exTrading) _exTrading[i].error = false;
      }

      for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
        var tmp = _exchanges.getObjectByIdx(i);

        if (_exTrading[i].error) _exTrading[i].trading = false;
        else tmp.buy(_data.position);
      }
    }
  }


  var _sellFunction = function() {
    // console.log('selling');
    if (_data.position !== 'short') {
      _data.state = 'selling';
      _updateActiveData();
      // _updateFunc(false);

      for (i in _exTrading) _exTrading[i].trading = true;

      if (_data.position === 'none') {
        for (i in _exTrading) _exTrading[i].error = false;
      }

      for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
        var tmp = _exchanges.getObjectByIdx(i);

        if (_exTrading[i].error) _exTrading[i].trading = false;
        else tmp.sell(_data.position);
      }
    }
  }


  var _exBoughtNotifyFunc = function(instInfo, errObject) {
    // console.log('boughtFunc')
    var idx = _exchanges.getObjectIdx(instInfo.id);

    _exTrading[idx].trading = false;

    if (errObject.error != ExError.ok) {
      _errorFunc(_strDesc._id, errorMessage({ code: '0x00B', strId: _strDesc._id, name: instInfo.name }));
      return _exTrading[idx].error = true;
    }

    if (_checkExsNotInTrade()) {
      if (_checkAtLstOneExNotErr()) {
        _tradingPostProcessing('buy');
      } else {
        _data.state === 'error';
        // _updateActiveData();
        _updateFunc(false);
      }
    }
  }


  var _exSoldNotifyFunc = function(instInfo, errObject) {
    // console.log('soldFunc')
    var idx = _exchanges.getObjectIdx(instInfo.id);

    _exTrading[idx].trading = false;

    if (errObject.error != ExError.ok) {
      _errorFunc(_strDesc._id, errorMessage({ code: '0x00C', strId: _strDesc._id, name: instInfo.name }));
      return _exTrading[idx].error = true;
    }

    if (_checkExsNotInTrade()) {
      if (_checkAtLstOneExNotErr()) {
        _tradingPostProcessing('sell');
      } else {
        _data.state === 'error';
        // _updateActiveData();
        _updateFunc(false);
      }
    }
  }


  var _tradingPostProcessing = function(trade) {
    // console.log(trade);

    var pos2Exit = '';

    if (trade === 'buy') pos2Exit = 'short';
    if (trade === 'sell') pos2Exit = 'long';


    if (_data.position === 'none') _data.inTime = new Date();
    if (_data.position === pos2Exit) _data.outTime = new Date();

    for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
      var tmp = _exchanges.getObjectByIdx(i);

      if (_data.position === 'none') {

        if (_exTrading[i].error) {

          _data.exchanges[i].inPrice = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
          _data.exchanges[i].volume = 0;

        } else {

          var tTmp = tmp.getTradePrice();
          if (tTmp.error !== ExError.ok) {

            var instInfo = tmp.getInstInfo();

            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x007', strId: _strDesc._id, name: instInfo.result.name }));
            }

            tTmp.result = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
          }
          _data.exchanges[i].inPrice = tTmp.result;


          var vTmp = tmp.getVolume();
          if (vTmp.error !== ExError.ok) {

            var instInfo = tmp.getInstInfo();

            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x008', strId: _strDesc._id, name: instInfo.result.name }));
            }

            vTmp.result = 0;
          }
          _data.exchanges[i].volume = vTmp.result;
        }
      }

      if (_data.position === pos2Exit) {

        if (_exTrading[i].error) {
          _data.exchanges[i].outPrice = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
        } else {

          var tTmp = tmp.getTradePrice();
          if (tTmp.error !== ExError.ok) {

            var instInfo = tmp.getInstInfo();

            if (instInfo.error !== ExError.ok) {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
            } else {
              _errorFunc(_strDesc._id, errorMessage({ code: '0x007', strId: _strDesc._id, name: instInfo.result.name }));
            }

            tTmp.result = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
          }
          _data.exchanges[i].outPrice = tTmp.result;

        }
      }
    }

    for (var i = 0; i < _plugins.getObjectsArray().length; i++) {
      var tmp = _plugins.getObjectByIdx(i);
      var exIdx = _exchanges.getObjectIdx(tmp.exId);

      if (_exTrading[exIdx].error) {
        if (trade === 'buy') tmp.inst.bought(_data.exchanges[exIdx].price[_data.exchanges[exIdx].price.length - 1]);
        if (trade === 'sell') tmp.inst.sold(_data.exchanges[exIdx].price[_data.exchanges[exIdx].price.length - 1]);

      } else {

        var tTmp = _exchanges.getObject(tmp.exId).getTradePrice();
        if (tTmp.error !== ExError.ok) {

          var instInfo = _exchanges.getObject(tmp.exId).getInstInfo();

          if (instInfo.error !== ExError.ok) {
            _errorFunc(_strDesc._id, errorMessage({ code: '0x005', strId: _strDesc._id }));
          } else {
            _errorFunc(_strDesc._id, errorMessage({ code: '0x007', strId: _strDesc._id, name: instInfo.result.name }));
          }

          tTmp.result = _data.exchanges[exIdx].price[_data.exchanges[exIdx].price.length - 1];
        }
        if (trade === 'buy') tmp.inst.bought(tTmp.result);
        if (trade === 'sell') tmp.inst.sold(tTmp.result);
      }

    }

    if (_data.position === 'none') {

      if (trade === 'buy') _data.position = 'long';
      if (trade === 'sell') _data.position = 'short';
      _data.state = 'in';
    } else if (_data.position === 'short' || _data.position == 'long') {
      _data.position = 'none';
      _data.state = 'out';
    }

    // _updateActiveData();
    _updateFunc(false);
  }


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


  var _checkExsNotInTrade = function() {
    for (i in _exTrading) {
      if (_exTrading[i].trading) return false;
    }

    return true;
  }


  var _checkAtLstOneExNotErr = function() {
    for (i in _exTrading) {
      if (!_exTrading[i].error) return true;
    }

    return false;
  }


  var _resetExTradingTraded = function() {
    for (i in _exTrading) {
      if (!_exTrading[i].error) return true;
    }

    return false;
  }


  var _clearNotifyValues = function() {
    for (var i = 0; i < _notifyMaskedValues.length; i++) {
      for (var j = 0; j < _notifyMaskedValues[i].getObjectsArray().length; j++) {
        _notifyMaskedValues[i].setObjectByIdx(j, _noneMask);
      }
    }
  }


  var _calcSchMUpdateTime = function() {
    var unit2Sec = 60; // 1 min
    _strDesc.updateTime + ' ' + _strDesc.timeUnit

    if (_strDesc.timeUnit === 'seconds') unit2Sec = 1;
    if (_strDesc.timeUnit === 'minutes') unit2Sec = 1 * 60;
    if (_strDesc.timeUnit === 'hours') unit2Sec = 1 * 60 * 60;
    if (_strDesc.timeUnit === 'day') unit2Sec = 1 * 60 * 60 * 24;

    return _strDesc.updateTime * unit2Sec;
  }


  var _createPlSwing = function(plugin) {
    var conf = Object.assign({}, PlSwing.ConfigDefault);
    conf.id = plugin._id;
    conf.name = plugin.name;
    conf.longNoPosNotifyPerc = plugin.lnpnp;
    conf.longAfterTopSellNotifyPerc = plugin.latsnp;
    conf.shortNoPosNotifyPerc = plugin.snpnp;
    conf.shortAfterBottomBuyNotifyPerc = plugin.sabbnp;
    conf.enableShort = plugin.enShort;
    conf.enableLong = plugin.enLong;

    _plugins.setObject(plugin._id, { inst: new PlSwing(), exId: plugin.exchange._id });
    return _plugins.getObject(plugin._id).inst.setConfig(conf);
  }


  var _createExKraken = function(exchange) {
    var conf = Object.assign({}, ExKraken.ConfigDefault);
    var tmp = Object.assign({}, exchange);

    delete tmp.createdAt;
    delete tmp.createdBy;
    delete tmp.modifiedAt;
    delete tmp.modifiedBy;
    delete tmp.ownerId;
    delete tmp.type;
    delete tmp.actives;

    renameObjKey(tmp, '_id', 'id');

    _exchanges.setObject(exchange._id, new ExKraken());
    var ret = _exchanges.getObject(exchange._id).setConfig(mergeObjects(conf, tmp));

    if (ret.error !== ExError.ok) return errHandle(StrError.ExConfigError, exchange.name);
    else return errHandle(StrError.ok, null);
  }


  var _createExTestData = function(exchange) {
    var conf = Object.assign({}, ExTestData.ConfigDefault);
    var tmp = Object.assign({}, exchange);

    delete tmp.createdAt;
    delete tmp.createdBy;
    delete tmp.modifiedAt;
    delete tmp.modifiedBy;
    delete tmp.ownerId;
    delete tmp.type;
    delete tmp.actives;

    renameObjKey(tmp, '_id', 'id');

    _exchanges.setObject(exchange._id, new ExTestData());
    var ret = _exchanges.getObject(exchange._id).setConfig(mergeObjects(conf, tmp));

    if (ret.error !== ExError.ok) return errHandle(StrError.ExConfigError, exchange.name);
    else return errHandle(StrError.ok, null);
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  this.getData = function() {
    return _data;
  }


  this.setNotifyFunction = function(notifyFunction) {
    _notifyFunc = notifyFunction;
  }


  this.setErrorFunction = function(errorFunction) {
    _errorFunc = errorFunction;
  }


  this.start = function() {
    _firstRun = true;

    if (_strDesc.timeUnit !== 'none') {
      if (_strDesc.timeUnit === 'seconds' || _strDesc.timeUnit === 'minutes' ||
        _strDesc.timeUnit === 'hours' || _strDesc.timeUnit === 'days') {
        SchM.createSchedule(_strDesc._id, _calcSchMUpdateTime(), _updateFunc, true);
      } else {
        SchMSC.createSchedule(_strDesc._id, 'every ' + _strDesc.updateTime + ' ' + _strDesc.timeUnit, _updateFunc, true);
      }
    }

    _updateFunc(true);
  }


  this.resume = function() {

    if (_strDesc.timeUnit !== 'none') {
      if (_strDesc.timeUnit === 'seconds' || _strDesc.timeUnit === 'minutes' ||
        _strDesc.timeUnit === 'hours' || _strDesc.timeUnit === 'days') {
        SchM.restartSchedule(_strDesc._id)
      } else {
        SchMSC.restartSchedule(_strDesc._id)
      }
    }

    _updateFunc(true);
  }


  this.stop = function() {

    if (_strDesc.timeUnit !== 'none') {
      if (_strDesc.timeUnit === 'seconds' || _strDesc.timeUnit === 'minutes' ||
        _strDesc.timeUnit === 'hours' || _strDesc.timeUnit === 'days') {
        SchM.removeSchedule(_strDesc._id)
      } else {
        SchMSC.removeSchedule(_strDesc._id)
      }
    }
  }


  this.pause = function() {

    if (_strDesc.timeUnit !== 'none') {
      if (_strDesc.timeUnit === 'seconds' || _strDesc.timeUnit === 'minutes' ||
        _strDesc.timeUnit === 'hours' || _strDesc.timeUnit === 'days') {
        SchM.stopSchedule(_strDesc._id)
      } else {
        SchMSC.stopSchedule(_strDesc._id)
      }
    }
  }


  this.stopTrading = function() {
    if (!_checkExsNotInTrade()) {
      for (i in _exTrading) {
        if (_exTrading[i].trading) {
          if (_exchanges.getObjectByIdx(i).stopTrade().error !== ExError.ok) {
            var instInfo = _exchanges.getObjectByIdx(i).getInstInfo();

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


  this.refresh = function() {
    _updateFunc(true);
  }


  this.buy = function() {
    if (_data.state !== 'buying' && _data.state !== 'selling') {
      _buyFunction();
    }
  }


  this.sell = function() {
    if (_data.state !== 'buying' && _data.state !== 'selling') {
      _sellFunction();
    }
  }


  this.getStatus = function() {
    return _constrError;
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/

  var _constructor = function(param) {
    var plCnt = 0;
    var exCnt = 0;
    _strDesc = Object.assign({}, param);

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


          /******** Plugin Creation Functions ********/

          /* swing */
          if (plugin.type === "plSwing") {
            if (!_createPlSwing(plugin)) {
              return _constrError = errorMessage({ code: '0x012', strId: _strDesc._id, name: plugin.name });
            }
          }

          /******** Plugin Creation Functions ********/


          var tmpPl = _plugins.getObject(plugin._id).inst;
          tmpPl.setBuyNotifyFunc(_buyNotification);
          tmpPl.setSellNotifyFunc(_sellNotification);


          /* initialize plugin elements of data information variable */
          _data.plugins[plCnt] = {};
          _data.plugins[plCnt].name = plugin.name;
          _data.plugins[plCnt].instInfo = tmpPl.getInstInfo();
          plCnt++;


          /* create not yet created exchange instances */
          if (_exchanges.getObject(plugin.exchange._id) === 'undefined') {


            /******** Exchange Creation Functions ********/


            /* kraken.com */
            if (plugin.exchange.type === 'exKraken') {
              _createExKraken(plugin.exchange);


              /* test data */
            } else if (plugin.exchange.type === 'exTestData') {
              if (_createExTestData(plugin.exchange).error !== StrError.ok) {
                return _constrError = errorMessage({ code: '0x000', strId: _strDesc._id, name: plugin.exchange.name });
              }
            }


            /******** Exchange Creation Functions ********/


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
            var tmpEx = _exchanges.getObject(plugin.exchange._id);
            _data.exchanges[exCnt] = {};
            _data.exchanges[exCnt].price = [];
            _data.exchanges[exCnt].name = plugin.exchange.name;

            var iTmp = tmpEx.getInstInfo();
            if (iTmp.error !== ExError.ok) return _constrError = errorMessage({ code: '0x005', strId: _strDesc._id });
            _data.exchanges[exCnt].instInfo = iTmp.result;

            var pTmp = tmpEx.getPairUnits();
            if (pTmp.error !== ExError.ok) return _constrError = errorMessage({ code: '0x006', strId: _strDesc._id, name: plugin.exchange.name });
            _data.exchanges[exCnt].units = pTmp.result;

            exCnt++;
          }
        }
      }
    }
  }

  _constructor(strategyDescription)
}
