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

// var _variable = 'Value';


/***********************************************************************
  Public Static Variable
 ***********************************************************************/




/***********************************************************************
  Private Static Function
 ***********************************************************************/

// var _variable = function(param){
//   return 'Value';
// }


/***********************************************************************
  Public Static Function
 ***********************************************************************/

// ClassName.function = function(param){
//   return 'Value';
// }


/***********************************************************************
  Class
 ***********************************************************************/

export function Strategy(strategyDescription) {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  // InheritancesClass.apply(this);


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
  var _updateCallFunc = function() {};

  var _action = '';

  var _data = {
    strategyId: '',
    strategyName: '',
    state: 'out',
    position: 'none',
    actionVals: [],
    plugins: [],
    exchanges: [],
    bundles: []
  };


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  // this.Variable = 'Value'; 


  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  var _updateFunc = function() {
    _clearNotifyValues();

    for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
      var tmp = _exchanges.getObjectByIdx(i);
      tmp.update();

      _data.exchanges[i].price = tmp.getPrice();
      _data.exchanges[i].info = tmp.getInfo();
    }

    for (var i = 0; i < _plugins.getObjectsArray().length; i++) {
      var tmp = _plugins.getObjectByIdx(i);
      tmp.inst.update(_exchanges.getObject(tmp.exId).getPrice());

      _data.plugins[i].state = tmp.inst.getState();
      _data.plugins[i].info = tmp.inst.getInfo();
    }

    _evalNotifyValues();

    _updateCallFunc(_data);
  }


  var _buyNotification = function(instInfo) {
    console.log(instInfo.id);

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
      param = {
        strategyId: _strDesc._id,
        action: 'none'
      };

      /* buy */
      if (finalDecision === _buyMask) {
        param.action = 'buy';
        _notifyFunc(param);

        _data.state = 'buy request';

        if (_strDesc.mode === 'auto') {
          _buyFunction();
        }
      }

      /* sell */
      if (finalDecision === _sellMask) {
        param.action = 'sell';
        _notifyFunc(param);

        _data.state = 'sell request';

        if (_strDesc.mode === 'auto') {
          _sellFunction();
        }
      }
    }
  }

  var _buyFunction = function() {
    console.log('buying');
    if (_data.position !== 'long') {

      for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
        var tmp = _exchanges.getObjectByIdx(i);
        tmp.buy();

        if (_data.position === 'none') {
          _data.actionVals[i].inPrice = tmp.getActionPrice();
          _data.actionVals[i].amount = tmp.getAmount();
        }

        if (_data.position === 'short') {
          _data.actionVals[i].outPrice = tmp.getActionPrice();
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

      _updateFunc();
    }
  }


  var _sellFunction = function() {
    console.log('selling');
    if (_data.position !== 'short') {

      for (var i = 0; i < _exchanges.getObjectsArray().length; i++) {
        var tmp = _exchanges.getObjectByIdx(i);
        tmp.sell();

        if (_data.position === 'none') {
          _data.actionVals[i].inPrice = tmp.getActionPrice();
          _data.actionVals[i].amount = tmp.getAmount();
        }

        if (_data.position === 'long') {
          _data.actionVals[i].outPrice = tmp.getActionPrice();
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

      _updateFunc();
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
    conf.counter = exchange.counter;
    conf.gain = exchange.gain;
    conf.data = exchange.data;
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

  this.develop = function() {
    return _strDesc;

  }


  this.getData = function() {
    return _data;
  }


  this.setNotifyFunction = function(notifyFunction) {
    _notifyFunc = notifyFunction;
  }


  this.setUpdateCallFunction = function(updateCallFunction) {
    _updateCallFunc = updateCallFunction;
  }


  this.start = function() {
    for (var k = 0; k < _exchanges.getObjects().length; k++) {
      _exchanges.getObjectByIdx(k).update();
    }

    for (var k = 0; k < _plugins.getObjects().length; k++) {
      _plugins.getObjectByIdx(k).inst.start(_exchanges.getObject(_plugins.getObjectByIdx(k).exId).getPrice());
    }

    SchM.createSchedule(_strDesc._id, 'every ' + _strDesc.updateTime + ' sec', _updateFunc);

    _updateFunc();
  }


  this.stop = function() {
    SchM.stopSchedule(_strDesc._id);
  }


  this.refresh = function() {
    _updateFunc();
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


        _data.bundles[i].plugins[j] = {"pId": plugin._id, "eId": plugin.exchange._id};


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
            _data.actionVals[exCnt] = {};
            _data.actionVals[exCnt].id = tmpEx.getInstInfo().id;
            _data.exchanges[exCnt] = {};
            _data.exchanges[exCnt].name = plugin.exchange.name;
            _data.exchanges[exCnt].instInfo = tmpEx.getInstInfo();
            _data.exchanges[exCnt].units = tmpEx.getPairUnits();
            exCnt++;
          }
        }
      }
    }

    // console.log(_strDesc);
  }

  _constructor(strategyDescription)
}
