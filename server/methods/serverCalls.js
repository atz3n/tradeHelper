import { Strategy } from '../trading/strategy/Strategy.js';
import { InstHandler } from '../lib/InstHandler.js';

strategies = new InstHandler();


Meteor.methods({

  startStrategy: function(strategyId) {

// console.log(getStrategyObject(strategyId).pluginBundles[0].bundlePlugins)
    if (strategies.getObject(strategyId) === 'undefined') {
      strategies.setObject(strategyId, { inst: new Strategy(getStrategyObject(strategyId)), startFlag: true });
      strategies.getObject(strategyId).inst.start();
    } else if (strategies.getObject(strategyId).startFlag === false) {
      strategies.getObject(strategyId).inst.start();
    }
  },

  pauseStrategy: function(strategyId) {

    if (strategies.getObject(strategyId) !== 'undefined') {
      if (strategies.getObject(strategyId).startFlag === true) {
        strategies.getObject(strategyId).inst.stop();
        strategies.getObject(strategyId).startFlag = false;
      }
    }

  },

  stopStrategy: function(strategyId) {

    if (strategies.getObject(strategyId) !== 'undefined') {
      strategies.getObject(strategyId).inst.stop();
      // console.log(strategies.getObjectsArray().delete(0));
      // strategies.getObjectsArray()[0]
      strategies.removeObject(strategyId);
    }

  },

  strategyDevelop: function() {

    var temp = strategies.getObjects();
    for (var i = 0; i < temp.length; i++) {

      console.log(temp[i].inst.develop());
    }

  }
});
