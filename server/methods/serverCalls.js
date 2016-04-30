Meteor.methods({

    startStrategy: function(strategyId) {

        console.log(getStrategyObject(strategyId).pluginBundles[1].bundlePlugins[0].type);
    }
});
