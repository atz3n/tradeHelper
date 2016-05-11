import { Strategy } from '../trading/strategy/Strategy.js';
import { InstHandler } from '../lib/InstHandler.js';

strategies = new InstHandler();

var oIdNfy = '';
var strIdNfy = '';
function notification(infos){
  
  /* to search as less as possible for the ownerId (cost a lot of time) */
  if(strIdNfy !== infos.strategyId){
    oIdNfy = Strategies.findOne({_id: infos.strategyId}).ownerId;
    strIdNfy = infos.strategyId;
  }

  Meteor.ClientCall.apply(oIdNfy, 'notification', [infos], function(error, result) {});
}


var oIdUpd = '';
var strIdUpd = '';
function update(infos){
  
  /* to search as less as possible for the ownerId (cost a lot of time) */
  if(strIdUpd !== infos.strategyId){
    oIdUpd = Strategies.findOne({_id: infos.strategyId}).ownerId;
    strIdUpd = infos.strategyId;
  }

  Meteor.ClientCall.apply(oIdUpd, 'update', [infos], function(error, result) {});
}





Meteor.methods({

  startStrategy: function(strategyId) {

    if (strategies.getObject(strategyId) === 'undefined') {
      strategies.setObject(strategyId, { inst: new Strategy(getStrategyObject(strategyId)), startFlag: true });
      strategies.getObject(strategyId).inst.setNotifyFunction(notification);
      strategies.getObject(strategyId).inst.setUpdateCallFunction(update);
      strategies.getObject(strategyId).inst.start();
    } else if (strategies.getObject(strategyId).startFlag === false) {
      strategies.getObject(strategyId).inst.start();
      strategies.getObject(strategyId).startFlag = true;
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
      strategies.removeObject(strategyId);
    }

  },

  getStrategyData: function(strategyId) {
    if (strategies.getObject(strategyId) !== 'undefined') {
      console.log(strategies.getObject(strategyId).inst.getData());
      return strategies.getObject(strategyId).inst.getData();
    }
  },

  strategyDevelop: function() {

    // var temp = strategies.getObjects();
    // for (var i = 0; i < temp.length; i++) {

    //   console.log(temp[i].inst.develop());
    // }

    PlDummys.remove({});
  }
});
