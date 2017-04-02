import { InstHandler } from './lib/InstHandler.js';


/***********************************************************************
  Import Plugin / Exchange
 ***********************************************************************/

import { PlStopLossOut } from './trading/plugins/PlStopLossOut.js';
import { PlTakeProfitOut } from './trading/plugins/PlTakeProfitOut.js';
import { PlTrailingStopIn } from './trading/plugins/PlTrailingStopIn.js';
import { PlTrailingStopOut } from './trading/plugins/PlTrailingStopOut.js';
import { PlDummy } from './trading/plugins/PlDummy.js';
import { PlProfitLineStopOut } from './trading/plugins/PlProfitLineStopOut.js';

import { ExTestData } from './trading/exchanges/ExTestData.js';
import { ExKraken } from './trading/exchanges/ExKraken.js';


/***********************************************************************
  Set db handler
 ***********************************************************************/

pluginHandler = new InstHandler();
exchangeHandler = new InstHandler();


/* Plugins */
pluginHandler.setObject('PlStopLossOutes', PlStopLossOutes);
pluginHandler.setObject('PlTakeProfitOuts', PlTakeProfitOuts);
pluginHandler.setObject('PlTrailingStopIns', PlTrailingStopIns);
pluginHandler.setObject('PlTrailingStopOuts', PlTrailingStopOuts);
pluginHandler.setObject('PlDummies', PlDummies);
pluginHandler.setObject('PlProfitLineStopOuts', PlProfitLineStopOuts);


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
this.createPlugin = function(plugin, logger, strPlHandler) {
  var conf = {};


  /***** add plugin default config here ******/

  if (plugin.type === 'plStopLossOut') conf = Object.assign({}, PlStopLossOut.ConfigDefault);
  if (plugin.type === 'plTakeProfitOut') conf = Object.assign({}, PlTakeProfitOut.ConfigDefault);
  if (plugin.type === 'plTrailingStopIn') conf = Object.assign({}, PlTrailingStopIn.ConfigDefault);
  if (plugin.type === 'plTrailingStopOut') conf = Object.assign({}, PlTrailingStopOut.ConfigDefault);
  if (plugin.type === 'plDummy') conf = Object.assign({}, PlDummy.ConfigDefault);
  if (plugin.type === 'plProfitLineStopOut') conf = Object.assign({}, PlProfitLineStopOut.ConfigDefault);

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

  if (plugin.type === 'plStopLossOut') strPlHandler.setObject(plugin._id, { inst: new PlStopLossOut(logger), exId: plugin.exchange._id });
  if (plugin.type === 'plTakeProfitOut') strPlHandler.setObject(plugin._id, { inst: new PlTakeProfitOut(logger), exId: plugin.exchange._id });
  if (plugin.type === 'plTrailingStopIn') strPlHandler.setObject(plugin._id, { inst: new PlTrailingStopIn(logger), exId: plugin.exchange._id });
  if (plugin.type === 'plTrailingStopOut') strPlHandler.setObject(plugin._id, { inst: new PlTrailingStopOut(logger), exId: plugin.exchange._id });
  if (plugin.type === 'plDummy') strPlHandler.setObject(plugin._id, { inst: new PlDummy(logger), exId: plugin.exchange._id });
  if (plugin.type === 'plProfitLineStopOut') strPlHandler.setObject(plugin._id, { inst: new PlProfitLineStopOut(logger), exId: plugin.exchange._id });

  /***** add plugin instance creation here ******/


  return strPlHandler.getObject(plugin._id).inst.setConfig(mergeObjects(conf, tmp));
}


/**
 * Function that creates an Exchange instance for Strategy.js
 * @param  {Object} exchange          exchange object including exchange configuration
 * @param  {Object} logger            logger instance 
 * @param  {InstHandler} strPlHandler Strategy's exchange handler
 * @return {errHandle object}         error
 */
this.createExchange = function(exchange, logger, strExHandler) {
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

  if (exchange.type === 'exKraken') strExHandler.setObject(exchange._id, new ExKraken(logger));
  if (exchange.type === 'exTestData') strExHandler.setObject(exchange._id, new ExTestData(logger));

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

/**
 * Returns an Plugin and optional the corresponding db 
 * @param  {Object} id    object which contains the id where the search depends on {id: <plugin id>, ownerId: <ownerId>}
 * @param  {Object} dbRef referenced db as optional return value {ref: <db cursor>}
 * @return {Object}       id corresponding plugin
 */
this.getPluginDbDoc = function(id, dbRef) {
  var id_ = mergeObjects({_id: 'undefined', ownerId: 'undefined'}, id);

  for (let k = 0; k < pluginHandler.getObjectsArray().length; k++) {
    var plugin;
    var pluginDb = pluginHandler.getObjectByIdx(k);

    if(id_._id !== 'undefined') plugin = pluginDb.find({ _id: id_._id }).fetch()[0];
    if(id_.ownerId !== 'undefined') plugin = pluginDb.find({ ownerId: id_.ownerId }).fetch()[0];

    if (typeof plugin !== "undefined") break;
  }

  if (typeof dbRef === "object") dbRef.ref = pluginDb;
  return plugin;
}


/**
 * Returns an Exchange and optional the corresponding db 
 * @param  {Object} id    object which contains the id where the search depends on {id: <exchange id>, ownerId: <ownerId>}
 * @param  {Object} dbRef referenced db as optional return value {ref: <db cursor>}
 * @return {Object}       id corresponding exchange
 */
this.getExchangeDbDoc = function(id, dbRef) {
  var id_ = mergeObjects({_id: 'undefined', ownerId: 'undefined'}, id);

  for (let k = 0; k < exchangeHandler.getObjectsArray().length; k++) {
    var exchange;
    var exchangeDb = exchangeHandler.getObjectByIdx(k);

    if(id_._id !== 'undefined') exchange = exchangeDb.find({ _id: id_._id }).fetch()[0];
    if(id_.ownerId !== 'undefined') exchange = exchangeDb.find({ ownerId: id_.ownerId }).fetch()[0];

    if (typeof exchange !== "undefined") break;
  }

  if (typeof dbRef === "object") dbRef.ref = exchangeDb;
  return exchange;
}


/**
 * Sets active state to all used db's from an active strategie
 * @param {String} strId   Strategy Id
 * @param {bool} enabled state (true = active / false = inactive)
 */
this.setActiveState = function(strId, enabled) {

  /* strategy */
  var strategy = Strategies.findOne({ _id: strId });
  Strategies.update({ _id: strId }, { $set: { active: enabled } });
  Strategies.update({ _id: strId }, { $set: { paused: false } });

  /* plugin bundles */
  var bundles = strategy.pluginBundles;
  for (i in bundles) {

     /* bundle plugins */
      var pluginIds = bundles[i].pluginIds;
      for (j in pluginIds) {


      /* plugins */
      for (let k = 0; k < pluginHandler.getObjectsArray().length; k++) {
        var pluginDb = pluginHandler.getObjectByIdx(k);
        var plugin = pluginDb.find({ _id: pluginIds[j] }).fetch()[0];

        if (typeof plugin !== "undefined") {
          if (enabled) pluginDb.update({ _id: plugin._id }, { $set: { actives: plugin.actives + 1 } });
          else if (plugin.actives >= 1) pluginDb.update({ _id: plugin._id }, { $set: { actives: plugin.actives - 1 } });
          break;
        }
      }


      /* exchanges */
      var exchange = plugin.exchange;
      if (typeof exchange !== "undefined") {


        for (let k = 0; k < exchangeHandler.getObjectsArray().length; k++) {
          var exchangeDb = exchangeHandler.getObjectByIdx(k);
          var tempEx = exchangeDb.find({ _id: exchange }).fetch()[0];

          if (typeof tempEx !== "undefined") {
            if (enabled) exchangeDb.update({ _id: tempEx._id }, { $set: { actives: tempEx.actives + 1 } });
            else if (tempEx.actives >= 1) exchangeDb.update({ _id: tempEx._id }, { $set: { actives: tempEx.actives - 1 } });
            break;
          }
        }
      }
    }
  }
}