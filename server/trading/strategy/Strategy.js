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

  var _action = '';

  var _lastPosition = 'none';

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
    _callNotifyFunc = false;


    if (fullUpdate) _clearNotifyValues();

    if (_data.curTime.length >= _numOfChartData) _data.curTime.shift();
    _data.curTime.push(new Date);

    for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
      var tmp = _exchanges.getObjectByIdx(i);
      if (fullUpdate) tmp.update();

      if (_data.exchanges[i].price.length >= _numOfChartData) _data.exchanges[i].price.shift();
      _data.exchanges[i].price.push(tmp.getPrice());
      _data.exchanges[i].info = tmp.getInfo();
    }

    for (var i = 0; i < _plugins.getObjectsArray().length; i++) {
      var tmp = _plugins.getObjectByIdx(i);
      if (fullUpdate) tmp.inst.update(_exchanges.getObject(tmp.exId).getPrice());

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
      tmp.exchanges[i].amount = _data.exchanges[i].amount;
      tmp.exchanges[i].config = _exchanges.getObject(tmp.exchanges[i].instInfo.id).getConfig();
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
    console.log('buying');
    if (_data.position !== 'long') {

      if (_data.position === 'none') _data.inTime = new Date();
      if (_data.position === 'short') _data.outTime = new Date();

      for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
        var tmp = _exchanges.getObjectByIdx(i);
        tmp.buy();

        if (_data.position === 'none') {
          _data.exchanges[i].inPrice = tmp.getActionPrice();
          _data.exchanges[i].amount = tmp.getAmount();
        }

        if (_data.position === 'short') {
          _data.exchanges[i].outPrice = tmp.getActionPrice();
        }
      }


      for (var i = 0; i < _plugins.getObjectsArray().length; i++) {
        var tmp = _plugins.getObjectByIdx(i);

        tmp.inst.bought(_exchanges.getObject(tmp.exId).getActionPrice());
      }

      if (_data.position === 'none') {
        _data.position = 'long';
        _data.state = 'in';
      }

      if (_data.position === 'short') {
        _data.position = 'none';
        _data.state = 'out';
      }

      // _updateFunc(false);
    }
  }


  var _sellFunction = function() {
    console.log('selling');
    if (_data.position !== 'short') {

      if (_data.position === 'none') _data.inTime = new Date();
      if (_data.position === 'long') _data.outTime = new Date();

      for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
        var tmp = _exchanges.getObjectByIdx(i);
        tmp.sell();

        if (_data.position === 'none') {
          _data.exchanges[i].inPrice = tmp.getActionPrice();
          _data.exchanges[i].amount = tmp.getAmount();
        }

        if (_data.position === 'long') {
          _data.exchanges[i].outPrice = tmp.getActionPrice();
        }
      }


      for (var i = 0; i < _plugins.getObjectsArray().length; i++) {
        var tmp = _plugins.getObjectByIdx(i);

        tmp.inst.sold(_exchanges.getObject(tmp.exId).getPrice());
      }

      if (_data.position === 'none') {
        _data.position = 'short';
        _data.state = 'in';
      }

      if (_data.position === 'long') {
        _data.position = 'none';
        _data.state = 'out';
      }

      // _updateFunc(false);
    }
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
    conf.cUnit = exchange.base;
    conf.dUnit = exchange.quote;

    switch (exchange.priceType) {
      case "Sinus":
        conf.priceType = ExTestData.priceType.sinus;
        break;
      case "Data":
        conf.priceType = ExTestData.priceType.data;
        break;
      default:
        conf.priceType = ExTestData.priceType.sinus;
    }

    _exchanges.setObject(exchange._id, new ExTestData());
    _exchanges.getObject(exchange._id).setConfig(conf);
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


  this.start = function() {
    for (var k = 0; k < _exchanges.getObjects().length; k++) {
      _exchanges.getObjectByIdx(k).update();
    }

    for (var k = 0; k < _plugins.getObjects().length; k++) {
      _plugins.getObjectByIdx(k).inst.start(_exchanges.getObject(_plugins.getObjectByIdx(k).exId).getPrice());
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


  this.refresh = function() {
    _updateFunc(true);
  }


  this.buy = function() {
    _buyFunction();
  }


  this.sell = function() {
    _sellFunction();
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
              _createExTestData(plugin.exchange);
            }

            /******** Exchange Creation Functions ********/


            /* initialize exchange elements of data information variable */
            var tmpEx = _exchanges.getObject(plugin.exchange._id);
            _data.exchanges[exCnt] = {};
            _data.exchanges[exCnt].price = [];
            _data.exchanges[exCnt].name = plugin.exchange.name;
            _data.exchanges[exCnt].instInfo = tmpEx.getInstInfo();
            _data.exchanges[exCnt].units = tmpEx.getPairUnits();
            exCnt++;
          }
        }
      }
    }
  }

  _constructor(strategyDescription)
}
