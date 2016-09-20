import { InstHandler } from './lib/InstHandler.js';


/***********************************************************************
  Import Plugin / Exchange
 ***********************************************************************/

import { PlSwing } from './trading/plugins/PlSwing.js';
import { PlStopLoss } from './trading/plugins/PlStopLoss.js';
import { PlTakeProfit } from './trading/plugins/PlTakeProfit.js';

import { ExTestData } from './trading/exchanges/ExTestData.js';
import { ExKraken } from './trading/exchanges/ExKraken.js';


/***********************************************************************
  Set db handler
 ***********************************************************************/

pluginHandler = new InstHandler();
exchangeHandler = new InstHandler();


/* Plugins */
pluginHandler.setObject('PlSwings', PlSwings);
pluginHandler.setObject('PlStopLosses', PlStopLosses);
pluginHandler.setObject('PlTakeProfits', PlTakeProfits);

/* Exchanges */
exchangeHandler.setObject('ExTestDatas', ExTestDatas);
exchangeHandler.setObject('ExKrakens', ExKrakens);


/***********************************************************************
  Functions that must be updated
 ***********************************************************************/

/**
 * Function that creates a Plugin instance for Strategy.js
 * @param  {Object} plugin            plugin object including plugin configuration
 * @param  {InstHandler} strPlHandler Strategy's plugin handler
 * @return {bool}                     error
 */
this.createPlugin = function(plugin, strPlHandler) {
  var conf = {};


  /***** add plugin default config here ******/

  if (plugin.type === 'plSwing') conf = Object.assign({}, PlSwing.ConfigDefault);
  if (plugin.type === 'plStopLoss') conf = Object.assign({}, PlStopLoss.ConfigDefault);
  if (plugin.type === 'plTakeProfit') conf = Object.assign({}, PlTakeProfit.ConfigDefault);

  /***** add plugin default config here ******/


  var tmp = Object.assign({}, plugin);

  delete tmp.exchange;
  delete tmp.createdAt;
  delete tmp.createdBy;
  delete tmp.modifiedAt;
  delete tmp.modifiedBy;
  delete tmp.ownerId;
  delete tmp.type;
  delete tmp.actives;

  renameObjKey(tmp, '_id', 'id');


  /***** add plugin instance creation here ******/

  if (plugin.type === 'plSwing') strPlHandler.setObject(plugin._id, { inst: new PlSwing(), exId: plugin.exchange._id });
  if (plugin.type === 'plStopLoss') strPlHandler.setObject(plugin._id, { inst: new PlStopLoss(), exId: plugin.exchange._id });
  if (plugin.type === 'plTakeProfit') strPlHandler.setObject(plugin._id, { inst: new PlTakeProfit(), exId: plugin.exchange._id });

  /***** add plugin instance creation here ******/


  return strPlHandler.getObject(plugin._id).inst.setConfig(mergeObjects(conf, tmp));
}


/**
 * Function that creates an Exchange instance for Strategy.js
 * @param  {Object} exchange          exchange object including exchange configuration
 * @param  {InstHandler} strPlHandler Strategy's exchange handler
 * @return {errHandle object}         error
 */
this.createExchange = function(exchange, strExHandler) {
  var conf = {};


  /***** add exchange default config here ******/

  if (exchange.type === 'exKraken') conf = Object.assign({}, ExKraken.ConfigDefault);
  if (exchange.type === 'exTestData') conf = Object.assign({}, ExTestData.ConfigDefault);

  /***** add exchange default config here ******/


  var tmp = Object.assign({}, exchange);

  delete tmp.createdAt;
  delete tmp.createdBy;
  delete tmp.modifiedAt;
  delete tmp.modifiedBy;
  delete tmp.ownerId;
  delete tmp.type;
  delete tmp.actives;

  renameObjKey(tmp, '_id', 'id');


  /***** add exchange instance creation here ******/

  if (exchange.type === 'exKraken') strExHandler.setObject(exchange._id, new ExKraken());
  if (exchange.type === 'exTestData') strExHandler.setObject(exchange._id, new ExTestData());

  /***** add exchange instance creation here ******/


  var ret = strExHandler.getObject(exchange._id).setConfig(mergeObjects(conf, tmp));

  if (ret.error !== ExError.ok) return errHandle(StrError.ExConfigError, exchange.name);
  else return errHandle(StrError.ok, null);
}


/**
 * Saves availabe trade pairs from exchanges into TradePairs db
 */
this.getExTradePairInfos = function() {
  var tmp = {};


  /* ExTestData */
  tmp = ExTestData.getTradePairInfos();
  if (tmp.error === ExError.ok) {
    if (typeof TradePairs.findOne({ type: 'ExTestData' }) === 'undefined') {
      TradePairs.insert(mergeObjects({ type: 'ExTestData' }, { pairs: [{ name: tmp.result, info: {} }] }));
    } else {
      TradePairs.update({ type: 'ExTestData' }, { $set: { pairs: [{ name: tmp.result, info: {} }] } });
    }
  }


  /* ExKraken */
  tmp = ExKraken.getTradePairInfos();
  if (tmp.error === ExError.ok) {

    var pairArray = [];
    for (i in tmp.result) pairArray.push({ name: i, info: tmp.result[i] })

    if (typeof TradePairs.findOne({ type: 'ExKraken' }) === 'undefined') {
      TradePairs.insert(mergeObjects({ type: 'ExKraken' }, { pairs: pairArray }));
    } else {
      TradePairs.update({ type: 'ExKraken' }, { $set: { pairs: pairArray } });
    }
  }
}


/***********************************************************************
  Functions that must NOT be updated
 ***********************************************************************/

this.getPluginDbDoc = function(id, dbRef) {
  for (let k = 0; k < pluginHandler.getObjectsArray().length; k++) {
    var pluginDb = pluginHandler.getObjectByIdx(k);
    var plugin = pluginDb.find({ _id: id }).fetch()[0];

    if (typeof plugin !== "undefined") break;
  }

  if (typeof dbRef === "object") dbRef.ref = pluginDb;
  return plugin;
}


this.getExchangeDbDoc = function(id, dbRef) {
  for (let k = 0; k < exchangeHandler.getObjectsArray().length; k++) {
    var exchangeDb = exchangeHandler.getObjectByIdx(k);
    var exchange = exchangeDb.find({ _id: id }).fetch()[0];

    if (typeof exchange !== "undefined") break;
  }

  if (typeof dbRef === "object") dbRef.ref = exchangeDb;
  return exchange;
}
