/**
 * assembles an strategy object that contains all informations
 * @param  {string} strategyId id of strategy from Strategies DB
 * @return {object} object that contains the complete strategy informations
 */
this.getStrategyObject = function(strategyId) {

  /* get strategy from db */
  var strategy = Strategies.findOne({ _id: strategyId });


  /* get plugin bundles from db and save them in strategy variable */
  var bundles = strategy.pluginBundles;
  for (var i = 0; i < bundles.length; i++) {

    bundles[i] = PluginBundles.find({ _id: bundles[i].bundle }).fetch()[0];


    /* get bundle plugins from db */
    var bundlePlugins = bundles[i].bundlePlugins;
    for (var j = 0; j < bundlePlugins.length; j++) {


      /* PlSwing */
      var plugin = PlSwings.find({ _id: bundlePlugins[j].plugin }).fetch()[0];

      /* PlDummy */
      if (typeof plugin === "undefined") {
        plugin = PlDummys.find({ _id: bundlePlugins[j].plugin }).fetch()[0];
      }


      bundlePlugins[j] = plugin;


      /* get exchanges from db */
      var exchange = bundlePlugins[j].exchange;
      if (typeof exchange !== "undefined") {


        /* ExKraken */
        var tempEx = ExKrakens.find({ _id: exchange }).fetch()[0];

        /* ExTestData */
        if (typeof tempEx === "undefined") {
          tempEx = ExTestDatas.find({ _id: exchange }).fetch()[0];
        }


        bundlePlugins[j].exchange = tempEx;
      }
    }
  }

  return strategy;
}


/**
 * returns an Json conform return Object
 * @param  {string} error value
 * @param  {string} result value
 * @return {object} object that contains an error and result object
 */
this.errHandle = function(error, result) {
  return { error: error, result: result };
}


this.deactivateStrategies = function() {
  Strategies.find().forEach(function(item) {
    var strId = item._id;

    /* strategy */
    var strategy = Strategies.findOne({ _id: strId });
    Strategies.update({ _id: strId }, { $set: { active: false } });
    Strategies.update({ _id: strId }, { $set: { paused: false } });

    /* plugin bundles */
    var bundles = strategy.pluginBundles;
    for (i in bundles) {

      bundles[i] = PluginBundles.find({ _id: bundles[i].bundle }).fetch()[0];
      PluginBundles.update({ _id: bundles[i]._id }, { $set: { actives: 0 } });


      /* bundle plugins */
      var bundlePlugins = bundles[i].bundlePlugins;
      for (j in bundlePlugins) {


        /* PlSwing */
        var plugin = PlSwings.find({ _id: bundlePlugins[j].plugin }).fetch()[0];
        if (typeof plugin !== "undefined") {
          PlSwings.update({ _id: plugin._id }, { $set: { actives: 0 } });
        }

        /* PlDummy */
        if (typeof plugin === "undefined") {
          plugin = PlDummys.find({ _id: bundlePlugins[j].plugin }).fetch()[0];
          if (typeof plugin !== "undefined") {
            PlDummys.update({ _id: plugin._id }, { $set: { actives: 0 } });
          }
        }


        /* exchanges */
        var exchange = plugin.exchange;
        if (typeof exchange !== "undefined") {


          /* ExKraken */
          var tempEx = ExKrakens.find({ _id: exchange }).fetch()[0];
          if (typeof tempEx !== "undefined") {
            ExKrakens.update({ _id: tempEx._id }, { $set: { actives: 0 } });
          }

          /* ExTestDatas */
          if (typeof tempEx === "undefined") {
            tempEx = ExTestDatas.find({ _id: exchange }).fetch()[0];
            if (typeof tempEx !== "undefined") {
              ExTestDatas.update({ _id: tempEx._id }, { $set: { actives: 0 } });
            }
          }
        }
      }
    }
  });
}


import { ExTestData } from '../trading/exchanges/ExTestData.js';
import { ExKraken } from '../trading/exchanges/ExKraken.js';
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
