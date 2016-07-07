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


      /******** Plugins ********/


      var plugin = PlSwings.find({ _id: bundlePlugins[j].plugin }).fetch()[0];

      if (typeof plugin === "undefined") {
        plugin = PlDummys.find({ _id: bundlePlugins[j].plugin }).fetch()[0];
      }


      /******** Plugins ********/


      bundlePlugins[j] = plugin;


      /* get exchanges from db */
      var exchange = bundlePlugins[j].exchange;


      /******** Exchanges ********/


      if (typeof exchange !== "undefined") {
        var tempEx = ExKrakens.find({ _id: exchange }).fetch()[0];

        if (typeof tempEx === "undefined") {
          tempEx = ExTestDatas.find({ _id: exchange }).fetch()[0];
        }


        /******** Exchanges ********/


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


/**
 * Merges two Objects where properties of object1 will be overwritten if they have the same name
 * @param  {Object} object1 an Object
 * @param  {Object} object2 another Object
 * @return {Object}         merged Object
 */
this.mergeObjects = function(object1, object2) {
  var tmp = {};
  for (var attrname in object1) { tmp[attrname] = object1[attrname]; }
  for (var attrname in object2) { tmp[attrname] = object2[attrname]; }
  return tmp;
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


import{ExTestData} from '../trading/exchanges/ExTestData.js';
this.getExTradePairInfos = function() {

  tmp = ExTestData.getTradePairInfos();
  if (tmp.error === ExError.ok) {

    if (typeof TradePairs.findOne({ type: 'ExTestData' }) === 'undefined') {
      ActiveDatas.insert(mergeObjects({ type: 'ExTestData' }, tmp.result));
    } else {
      ActiveDatas.update({ type: 'ExTestData' }, { $set: mergeObjects({ type: 'ExTestData' }, tmp.result) });
    }
  }

}
