import { Strategy } from '../trading/strategy/Strategy.js';
import { InstHandler } from '../lib/InstHandler.js';

strategies = new InstHandler();

Meteor.methods({

    startStrategy: function(strategyId) {

        strategies.addObject(strategyId, new Strategy(getStrategyObject(strategyId)));

        // console.log(getStrategyObject(strategyId).pluginBundles[1].bundlePlugins[0].type);
    },

    stopStrategy: function(strategyId) {
        var temp = strategies.getObjects();
        for (i = 0; i < temp.length; i++) {

            console.log(temp[i].develop().pluginBundles[0].bundlePlugins);
        }

    }
});
