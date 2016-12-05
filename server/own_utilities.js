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

    bundles[i].bundlePlugins = [];
    var bundlePlugins = bundles[i].bundlePlugins;
    for (var j = 0; j < bundles[i].pluginIds.length; j++) {

      /* get bundle plugins from db */
      bundlePlugins.push(getPluginDbDoc({_id: bundles[i].pluginIds[j]}))

      /* get exchanges from db */
      var exchange = bundlePlugins[j].exchange;
      if (typeof exchange !== "undefined") {
        bundlePlugins[j].exchange = getExchangeDbDoc({_id: exchange});
      }
    }

    delete bundles[i].pluginIds;
  }

  return strategy;
}


/**
 * Deactivates all active Strategies
 */
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

      /* bundle plugins */
      var pluginIds = bundles[i].pluginIds;
      for (j in pluginIds) {

        /* Plugins */
        var pluginDb = {};
        var plugin = getPluginDbDoc({_id: pluginIds[j]}, pluginDb);
        if (typeof plugin !== "undefined") {
          pluginDb.ref.update({ _id: plugin._id }, { $set: { actives: 0 } });


          /* Exchanges */
          var exchangeDb = {};
          var tempEx = getExchangeDbDoc({_id: plugin.exchange}, exchangeDb);
          if (typeof tempEx !== "undefined") exchangeDb.ref.update({ _id: tempEx._id }, { $set: { actives: 0 } });
        }
      }
    }
  });
  ActiveDatas.remove({});
}