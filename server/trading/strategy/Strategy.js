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
      _exchanges.getObjectByIdx(i).update();
    }

    for (var i = 0; i < _plugins.getObjectsArray().length; i++) {
      _plugins.getObjectByIdx(i).inst.update(_exchanges.getObject(_plugins.getObjectByIdx(i).exId).getPrice());
      console.log(_plugins.getObjectByIdx(i).inst.getInfo());
    }

    _evalNotifyValues();

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
      console.log('pluginBundleVals[' + i + '] before: ' + pluginBundleVals[i])

      if (pluginBundleVals[i] !== _buyMask && pluginBundleVals[i] !== _sellMask) {
        pluginBundleVals[i] = _noneMask;
      }
      console.log('pluginBundleVals[' + i + '] after: ' + pluginBundleVals[i])

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
        action: 'none'
      };

      /* buy */
      if (finalDecision === _buyMask) {
        param.action = 'buy';
        _notifyFunc(param);
        console.log('buy')
      }

      /* sell */
      if (finalDecision === _sellMask) {
        param.action = 'sell';
        _notifyFunc(param);
        console.log('sell')
      }
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


  this.setNotifyFunction = function(notifyFunction){
    _notifyFunc = notifyFunction;
  }


  this.start = function() {
    for (var k = 0; k < _exchanges.getObjects().length; k++) {
      _exchanges.getObjectByIdx(k).update();
    }

    for (var k = 0; k < _plugins.getObjects().length; k++) {
      _plugins.getObjectByIdx(k).inst.start(_exchanges.getObject(_plugins.getObjectByIdx(k).exId).getPrice());
    }

    SchM.createSchedule(_strDesc._id, 'every ' + _strDesc.updateTime + ' sec', _updateFunc);
  }


  this.stop = function() {
    SchM.stopSchedule(_strDesc._id);
  }


  /***********************************************************************
    Constructor
   ***********************************************************************/

  var _constructor = function(param) {
    _strDesc = Object.assign({}, param);


    /* create plugin and exchange instances */
    for (var i = 0; i < _strDesc.pluginBundles.length; i++) {

      /* create notify handler to create plugin structure */
      _notifyMaskedValues[i] = new InstHandler();

      for (var j = 0; j < _strDesc.pluginBundles[i].bundlePlugins.length; j++) {
        var plugin = _strDesc.pluginBundles[i].bundlePlugins[j];

        /* add plugin id for evaluation */
        // console.log(plugin._id)
        _notifyMaskedValues[i].setObject(plugin._id, _noneMask);


        /* create not yet created plugin instances */
        if (_plugins.getObject(plugin._id) === 'undefined') {

          /* swing */
          if (plugin.type === "plSwing") {
            _createPlSwing(plugin);
          }

          _plugins.getObject(plugin._id).inst.setBuyNotifyFunc(_buyNotification);
          _plugins.getObject(plugin._id).inst.setSellNotifyFunc(_sellNotification);


          /* create not yet created exchange instances */
          if (_exchanges.getObject(plugin.exchange._id) === 'undefined') {

            /* kraken.com */
            if (plugin.exchange.type === 'exKraken') {
              _createExKraken(plugin.exchange);

              /* test data */
            } else if (plugin.exchange.type === 'exTestData') {
              _createExTestData(plugin.exchange);
            }
          }
        }
      }
    }
    for(var i = 0 ; i < _notifyMaskedValues.length ; i++){
        console.log(_notifyMaskedValues[i].getObjects())
    }
  }

  _constructor(strategyDescription)
}
