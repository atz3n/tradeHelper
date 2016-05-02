import { Strategy } from '../trading/strategy/Strategy.js';
import { InstHandler } from '../lib/InstHandler.js';

strategies = new InstHandler();


Meteor.methods({

  startStrategy: function(strategyId) {

    if (strategies.getObject(strategyId) === 'undefined') {
      strategies.addObject(strategyId, { inst: new Strategy(getStrategyObject(strategyId)), startFlag: true });
      strategies.getObject(strategyId).inst.start();
    } else if (strategies.getObject(strategyId).startFlag === false) {
      strategies.addObject(strategyId, { inst: new Strategy(getStrategyObject(strategyId)), startFlag: true });
      strategies.getObject(strategyId).inst.start();
    }

  },

  stopStrategy: function(strategyId) {

    if (strategies.getObject(strategyId) !== 'undefined') {
      if (strategies.getObject(strategyId).startFlag === true) {
        strategies.getObject(strategyId).inst.stop();
        strategies.getObject(strategyId).startFlag = false;
      }
    }

  },

  strategyDevelop: function() {

    var temp = strategies.getObjects();
    for (i = 0; i < temp.length; i++) {

      console.log(temp[i].inst.develop().pluginBundles[0].bundlePlugins);
    }

  }
});
