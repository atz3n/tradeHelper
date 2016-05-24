import { Strategy } from '../trading/strategy/Strategy.js';
import { InstHandler } from '../lib/InstHandler.js';

strategies = new InstHandler();

var oIdNfy = '';
var strIdNfy = '';

function notification(infos) {

  /* to search as less as possible for the ownerId */
  if (strIdNfy !== infos.strategyId) {
    oIdNfy = Strategies.findOne({ _id: infos.strategyId }).ownerId;
    strIdNfy = infos.strategyId;
  }

  Meteor.ClientCall.apply(oIdNfy, 'notification', [infos], function(error, result) {});
}


Meteor.methods({

  strategyStart: function(strategyId) {

    if (strategies.getObject(strategyId) === 'undefined') {
      strategies.setObject(strategyId, { inst: new Strategy(getStrategyObject(strategyId)), startFlag: true });
      strategies.getObject(strategyId).inst.setNotifyFunction(notification);
      strategies.getObject(strategyId).inst.start();
    } else if (strategies.getObject(strategyId).startFlag === false) {
      strategies.getObject(strategyId).inst.start();
      strategies.getObject(strategyId).startFlag = true;
    } else {
      return false;
    }

    return true;
  },

  strategyPause: function(strategyId) {

    if (strategies.getObject(strategyId) !== 'undefined') {
      if (strategies.getObject(strategyId).startFlag === true) {
        strategies.getObject(strategyId).inst.stop();
        strategies.getObject(strategyId).startFlag = false;
      }
    } else {
      return false;
    }

    return true;
  },

  strategyStop: function(strategyId) {

    if (strategies.getObject(strategyId) !== 'undefined') {
      strategies.getObject(strategyId).inst.stop();
      strategies.removeObject(strategyId);
      ActiveDatas.remove({ strategyId: strategyId });
    } else {
      return false;
    }

    return true;
  },

  strategyBuy: function(strategyId) {

    if (strategies.getObject(strategyId) !== 'undefined') {
      strategies.getObject(strategyId).inst.buy();
    } else {
      return false;
    }

    return true;
  },

  strategySell: function(strategyId) {

    if (strategies.getObject(strategyId) !== 'undefined') {
        strategies.getObject(strategyId).inst.sell();
    } else {
      return false;
    }

    return true;
  },

  strategyRefresh: function(strategyId) {
    if (strategies.getObject(strategyId) !== 'undefined') {
      strategies.getObject(strategyId).inst.refresh();
    } else {
      return false;
    }

    return true;
  },

  strategyGetData: function(strategyId) {
    if (strategies.getObject(strategyId) !== 'undefined') {
      return strategies.getObject(strategyId).inst.getData();
    }
  },

  develop: function(strategyId) {
    console.log('bla');
    console.log(strategyId);
    if (strategies.getObject(strategyId) !== 'undefined') {
      console.log(JSON.stringify(strategies.getObject(strategyId).inst.develop()))
    }
  }
});
