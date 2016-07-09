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


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  var _updateFunc = function(fullUpdate) {
    if (_checkExsNotInTrade()) {

      _callNotifyFunc = false;


      if (fullUpdate) _clearNotifyValues();

      if (_data.curTime.length >= _numOfChartData) _data.curTime.shift();
      _data.curTime.push(new Date);

      for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
        var tmp = _exchanges.getObjectByIdx(i);
        if (fullUpdate) {
          if (tmp.update().error !== ExError.ok) {
            _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x004'))
          }
        }

        if (_data.exchanges[i].price.length >= _numOfChartData) _data.exchanges[i].price.shift();

        var pTmp = tmp.getPrice();
        if (pTmp.error !== ExError.ok) {
          _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x002'));
          if (_data.exchanges[i].price.length === 0) pTmp.result = 0;
          else pTmp.result = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
        }
        _data.exchanges[i].price.push(pTmp.result);

        var iTmp = tmp.getInfo();
        if (iTmp.error !== ExError.ok) {
          _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x003'));
          iTmp.result = [];
        }
        _data.exchanges[i].info = iTmp;
      }

      for (var i = 0; i < _plugins.getObjectsArray().length; i++) {
        var tmp = _plugins.getObjectByIdx(i);
        if (fullUpdate) {
          var pTmp = _exchanges.getObject(tmp.exId).getPrice();
          if (pTmp.error !== ExError.ok) {
            _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x002'));
            pTmp.result = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
          }
          tmp.inst.update(pTmp.result);
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
        _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x001'));
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
      _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x00B'))
      return _exTrading[idx].error = true;
    }

    if (_checkExsNotInTrade()) {
      if (_checkAtLstOneExNotErr()) {
        _tradingPostProcessing('bought');
      } else {
        _data.state === 'error';
        _updateActiveData();
      }
    }
  }


  var _exSoldNotifyFunc = function(instInfo, errObject) {
    // console.log('soldFunc')
    var idx = _exchanges.getObjectIdx(instInfo.id);

    _exTrading[idx].trading = false;

    if (errObject.error != ExError.ok) {
      _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x00B'))
      return _exTrading[idx].error = true;
    }

    if (_checkExsNotInTrade()) {
      if (_checkAtLstOneExNotErr()) {
        _tradingPostProcessing('sold');
      } else {
        _data.state === 'error';
        _updateActiveData();
      }
    }
  }


  var _tradingPostProcessing = function(trade) {
    // console.log(trade);

    var pos2 = '';

    if (trade === 'bought') pos2 = 'short';
    if (trade === 'sold') pos2 = 'long';


    if (_data.position === 'none') _data.inTime = new Date();
    if (_data.position === pos2) _data.outTime = new Date();

    for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
      var tmp = _exchanges.getObjectByIdx(i);

      if (_data.position === 'none') {

        if (_exTrading[i].error) {

          _data.exchanges[i].inPrice = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
          _data.exchanges[i].volume = 0;

        } else {

          var tTmp = tmp.getTradePrice();
          if (tTmp.error !== ExError.ok) {
            _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x007'));
            tTmp.result = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
          }
          _data.exchanges[i].inPrice = tTmp.result;


          var vTmp = tmp.getVolume();
          if (vTmp.error !== ExError.ok) {
            _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x008'));
            vTmp.result = 0;
          }
          _data.exchanges[i].volume = vTmp.result;
        }
      }

      if (_data.position === pos2) {

        if (_exTrading[i].error) {
          _data.exchanges[i].outPrice = _data.exchanges[i].price[_data.exchanges[i].price.length - 1];
        } else {

          var tTmp = tmp.getTradePrice();
          if (tTmp.error !== ExError.ok) {
            _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x007'));
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
        if (trade === 'bought') tmp.inst.bought(_data.exchanges[exIdx].price[_data.exchanges[exIdx].price.length - 1]);
        if (trade === 'sold') tmp.inst.sold(_data.exchanges[exIdx].price[_data.exchanges[exIdx].price.length - 1]);

      } else {

        var tTmp = _exchanges.getObject(tmp.exId).getTradePrice();
        if (tTmp.error !== ExError.ok) {
          _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x007'));
          tTmp.result = _data.exchanges[exIdx].price[_data.exchanges[exIdx].price.length - 1];
        }
        if (trade === 'bought') tmp.inst.bought(tTmp.result);
        if (trade === 'sold') tmp.inst.sold(tTmp.result);
      }

    }

    if (_data.position === 'none') {

      if (trade === 'bought') _data.position = 'long';
      if (trade === 'sold') _data.position = 'short';
      _data.state = 'in';
    } else if (_data.position === 'short' || _data.position == 'long') {
      _data.position = 'none';
      _data.state = 'out';
    }

    _updateActiveData();
    _update(false);
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


  var _createPlSwing = function(plugin) {
    var conf = Object.assign({}, PlSwing.ConfigDefault);
    conf.id = plugin._id;
    conf.longNoPosNotifyPerc = plugin.lnpnp;
    conf.longAfterTopSellNotifyPerc = plugin.latsnp;
    conf.shortNoPosNotifyPerc = plugin.snpnp;
    conf.shortAfterBottomBuyNotifyPerc = plugin.sabbnp;
    conf.enableShort = plugin.enShort;
    conf.enableLong = plugin.enLong;

    _plugins.setObject(plugin._id, { inst: new PlSwing(), exId: plugin.exchange._id });
    _plugins.getObject(plugin._id).inst.setConfig(conf);
  }


  var _createExKraken = function(exchange) {
    var conf = Object.assign({}, ExKraken.ConfigDefault);
    conf.id = exchange._id;
    switch (exchange.pair) {
      case "Ether/Euro":
        conf.pair = ExKraken.Pair.eth_eur;
        break;
      case "Ether/Bitcoin":
        conf.pair = ExKraken.Pair.eth_btc;
        break;
      case "Bitcoin/Euro":
        conf.pair = ExKraken.Pair.btc_eur;
        break;
      default:
        conf.pair = ExKraken.Pair.btc_eur;
    }

    _exchanges.setObject(exchange._id, new ExKraken());
    _exchanges.getObject(exchange._id).setConfig(conf);
  }


  var _createExTestData = function(exchange) {
    var conf = Object.assign({}, ExTestData.ConfigDefault);
    conf.id = exchange._id;
    conf.startVal = exchange.startVal;
    conf.offset = exchange.offset;
    conf.stepWidth = exchange.stepWidth;
    conf.gain = exchange.gain;
    conf.data = exchange.data;
    conf.balanceAmount = exchange.balanceAmount;
    conf.tradeDelaySec = exchange.tradeDelaySec;
    conf.priceType = exchange.priceType;


    _exchanges.setObject(exchange._id, new ExTestData());
    var ret = _exchanges.getObject(exchange._id).setConfig(conf);

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
    for (var k = 0; k < _exchanges.getObjects().length; k++) {
      _exchanges.getObjectByIdx(k).update();
    }

    for (var k = 0; k < _plugins.getObjects().length; k++) {
      var tmp = _exchanges.getObject(_plugins.getObjectByIdx(k).exId).getPrice();

      if (tmp.error !== ExError.ok) {
        _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x002'));
        tmp.result = 0;
      }

      _plugins.getObjectByIdx(k).inst.start(tmp.result);
    }

    if (_strDesc.timeUnit !== 'none') {
      SchM.createSchedule(_strDesc._id, 'every ' + _strDesc.updateTime + ' ' + _strDesc.timeUnit, _updateFunc, true);
    }

    _updateFunc(false);
  }


  this.resume = function() {

    if (_strDesc.timeUnit !== 'none') {
      SchM.createSchedule(_strDesc._id, 'every ' + _strDesc.updateTime + ' ' + _strDesc.timeUnit, _updateFunc, true);
    }

    _updateFunc(true);
  }


  this.stop = function() {
    if (_strDesc.timeUnit !== 'none') {
      SchM.stopSchedule(_strDesc._id);
    }
  }


  this.stopTrading = function() {
    if (!_checkExsNotInTrade()) {
      for (i in _exTrading) {
        if (_exTrading[i].trading) {
          if (_exchanges.getObjectByIdx(i).stopTrade().error !== ExError.ok) {
            _errorFunc(_strDesc._id, errHandle(StrError.errCode, '0x00D'));
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
            _createPlSwing(plugin);
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
                return _constrError = errHandle(StrError.errCode, '0x000');
              }
            }


            /******** Exchange Creation Functions ********/


            /* check if position configuration works */
            var plPositions = _plugins.getObject(plugin._id).inst.getPositions();
            var exPositions = _exchanges.getObject(plugin.exchange._id).getPositions();
            if(exPositions.error !== ExError.ok) return _constrError = errHandle(StrError.errCode, '0x00E');
            
            if(plPositions.long){
              if(!exPositions.result.long) return _constrError = errHandle(StrError.errCode, '0x00F');
            }

            if(plPositions.short){
              if(!exPositions.result.short) return _constrError = errHandle(StrError.errCode, '0x010');
            }


            /* set notify functions */
            if (_exchanges.getObject(plugin.exchange._id).setBoughtNotifyFunc(_exBoughtNotifyFunc).error !== ExError.ok) {
              return _constrError = errHandle(StrError.errCode, '0x009');
            }

            if (_exchanges.getObject(plugin.exchange._id).setSoldNotifyFunc(_exSoldNotifyFunc).error !== ExError.ok) {
              return _constrError = errHandle(StrError.errCode, '0x00A');
            }

            _exTrading.push({ trading: false, error: false });

            /* initialize exchange elements of data information variable */
            var tmpEx = _exchanges.getObject(plugin.exchange._id);
            _data.exchanges[exCnt] = {};
            _data.exchanges[exCnt].price = [];
            _data.exchanges[exCnt].name = plugin.exchange.name;

            var iTmp = tmpEx.getInstInfo();
            if (iTmp.error !== ExError.ok) return _constrError = errHandle(StrError.errCode, '0x005');
            _data.exchanges[exCnt].instInfo = iTmp.result;

            var pTmp = tmpEx.getPairUnits();
            if (pTmp.error !== ExError.ok) return _constrError = errHandle(StrError.errCode, '0x006');
            _data.exchanges[exCnt].units = pTmp.result;

            exCnt++;
          }
        }
      }
    }
  }

  _constructor(strategyDescription)
}
