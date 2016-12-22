import { Strategy } from '../trading/strategy/Strategy.js';
import { InstHandler } from '../lib/InstHandler.js';


strategies = new InstHandler();


/***********************************************************************
  Callback functions
 ***********************************************************************/

var nOIdNfy = '';
var nStrIdNfy = '';

function notification(infos) {

  /* to search as less as possible for the ownerId */
  if (nStrIdNfy !== infos.strategyId) {
    nOIdNfy = Strategies.findOne({ _id: infos.strategyId }).ownerId;
    nStrIdNfy = infos.strategyId;
  }
  Meteor.ClientCall.apply(nOIdNfy, 'notification', [infos], function(error, result) {});
}


var sOIdNfy = '';
var sStrIdNfy = '';

function strError(strategyId, errObj) {

  /* to search as less as possible for the ownerId */
  if (sStrIdNfy !== strategyId) {
    sOIdNfy = Strategies.findOne({ _id: strategyId }).ownerId;
    sStrIdNfy = strategyId;
  }
  Meteor.ClientCall.apply(sOIdNfy, 'error', [errMessage(errObj, strategyId)], function(error, result) {});
}


/***********************************************************************
  Private functions
 ***********************************************************************/

var start = function(strategyId) {
  if (strategies.getObject(strategyId) === 'undefined') {

    strategies.setObject(strategyId, { inst: new Strategy(getStrategyObject(strategyId), createPlugin, createExchange), startFlag: true });
    var ret = strategies.getObject(strategyId).inst.getStatus();
    if (ret.error !== StrError.ok) return ret;

    strategies.getObject(strategyId).inst.setNotifyFunction(notification);
    strategies.getObject(strategyId).inst.setErrorFunction(strError);
    strategies.getObject(strategyId).inst.start();

  } else if (strategies.getObject(strategyId).startFlag === false) {
    strategies.getObject(strategyId).inst.resume();
    strategies.getObject(strategyId).startFlag = true;
  } else {
    return errHandle(StrError.notFound, strategyId);
  }

  return errHandle(StrError.ok, null);
}


var pause = function(strategyId) {
  if (strategies.getObject(strategyId) !== 'undefined') {
    if (strategies.getObject(strategyId).startFlag === true) {
      strategies.getObject(strategyId).inst.pause();
      strategies.getObject(strategyId).startFlag = false;
    }
  } else {
    return errHandle(StrError.notFound, strategyId)
  }

  return errHandle(StrError.ok, null);
}


var stop = function(strategyId) {
  if (strategies.getObject(strategyId) !== 'undefined') {
    strategies.getObject(strategyId).inst.stop();
    strategies.removeObject(strategyId);
    ActiveDatas.remove({ strategyId: strategyId });
    setActiveState(strategyId, false);
  } else {
    return errHandle(StrError.notFound, strategyId)
  }

  return errHandle(StrError.ok, null);
}


var buy = function(strategyId) {
  if (strategies.getObject(strategyId) !== 'undefined') {
    strategies.getObject(strategyId).inst.buy();
  } else {
    return errHandle(StrError.notFound, strategyId)
  }

  return errHandle(StrError.ok, null);
}


var sell = function(strategyId) {

  if (strategies.getObject(strategyId) !== 'undefined') {
    strategies.getObject(strategyId).inst.sell();
  } else {
    return errHandle(StrError.notFound, strategyId)
  }

  return errHandle(StrError.ok, null);
}


var refresh = function(strategyId) {
  if (strategies.getObject(strategyId) !== 'undefined') {
    strategies.getObject(strategyId).inst.refresh();
  } else {
    return errHandle(StrError.notFound, strategyId)
  }

  return errHandle(StrError.ok, null);
}


var stopTrade = function(strategyId) {
  if (strategies.getObject(strategyId) !== 'undefined') {
    strategies.getObject(strategyId).inst.stopTrading();
  } else {
    return errHandle(StrError.notFound, strategyId)
  }

  return errHandle(StrError.ok, null);
}


var tradePairInfos = function(exchangeType) {
  if (exchangeType === 'ExTestData') {
    var tmp = ExTestData.getTradePairInfos();
    if(tmp.error !== ExError.ok) return errHandle(ExError.srvConError, null); 
    return tmp;
  }

  if (exchangeType === 'ExKraken') {
    var tmp = ExKraken.getTradePairInfos();
    if(tmp.error !== ExError.ok) return errHandle(ExError.srvConError, null); 
    return tmp;
  }

  return errHandle(ExError.exTypNotFound, exchangeType);
}


var errMessage = function(errHandleObject, strategyId) {

  if (errHandleObject.error === StrError.ok) {
    return errHandle(null, null);
  }

  if (errHandleObject.error === ExError.ok) {
    return errHandle(null, errHandleObject.result);
  }

  if (errHandleObject.error === StrError.notFound) {
    return errHandle('error', 'Strategy: ' + errHandleObject.result + ' not found!');
  }

  if (errHandleObject.error === StrError.error) {
    return errHandle('error', errHandleObject.result);
  }

  if(errHandleObject.error === ExError.srvConError) {
    return errHandle('error', 'Could not connect to server');
  }

  if(errHandleObject.error === ExError.finished) {
    pause(strategyId);
    Strategies.update({ _id: strategyId }, { $set: { paused: true } });
    return errHandle('info', errHandleObject.result);
  }

  if (errHandleObject.error === StrError.info) {
    return errHandle('info', errHandleObject.result);
  }

  return errHandle('error', 'Sorry, an unknown error occurred!');
}


var stopActives = function(userId) {
  Strategies.find({ownerId: userId}).fetch().forEach(function(item) {
    stop(item._id);
  });
}


/***********************************************************************
  Meteor server methods
 ***********************************************************************/

Meteor.methods({

  /*************** trading functions  ***************/

  strategyStart: function(strategyId) {
    var tmp = start(strategyId);

    if (tmp.error !== StrError.ok) {
      stop(strategyId);
    } else {
      setActiveState(strategyId, true);
    }

    return errMessage(tmp, strategyId);
  },

  strategyPause: function(strategyId) {
    return errMessage(pause(strategyId));
  },

  strategyStop: function(strategyId) {
    return errMessage(stop(strategyId));
  },

  strategyBuy: function(strategyId) {
    return errMessage(buy(strategyId));
  },

  strategySell: function(strategyId) {
    return errMessage(sell(strategyId));
  },

  strategyRefresh: function(strategyId) {
    return errMessage(refresh(strategyId));
  },

  strategyStopTrade: function(strategyId) {
    return errMessage(stopTrade(strategyId));
  },

  exchangeTradePairInfos: function(exchangeType) {
    return errMessage(tradePairInfos(exchangeType));
  },


  /*************** system functions  ***************/

  checkAccessCode: function(accessCode) {
    if(accessCode === Meteor.settings.private.AccessCode) return true;
    else return false;
  },


  /*************** admin functions  ***************/

  stopUserActives: function(userId) {
    stopActives(userId);
  },

  deleteUser: function(userId) {
    stopActives(userId);

    Strategies.remove({ownerId: userId});
    ActiveDatas.remove({ownerId: userId});
    Histories.remove({ownerId: userId});
    PluginBundles.remove({ownerId: userId});
    Settings.remove({ownerId: userId});
    Users.remove({_id: userId});


    var tmp = {};

    /* delete Plugins */
    while(true) {
      if(getPluginDbDoc({ownerId: userId}, tmp)){
        tmp.ref.remove({ownerId:userId});
      } else break;
    }

    /* delete Exchanges */
    while(true) {
      if(getExchangeDbDoc({ownerId: userId}, tmp)){
        tmp.ref.remove({ownerId:userId});
      } else break;
    }
  },


  /*************** user functions  ***************/

  getLogins: function() {
    var ret = [];
    
    if(Meteor.user() !== null) {   
      var tmp = Meteor.user().services.resume.loginTokens;
      for(i in tmp) ret.push({login: tmp[i].when});
    }
  
    return ret;
  },

  logoutEntity: function(date) {
    if(Meteor.user() !== null) {
      var tmp = Meteor.user().services.resume.loginTokens;

      tmp = tmp.filter(function(obj){
        return obj.when.toISOString() !== new Date(date).toISOString();
      });

      Users.update({_id : Meteor.userId()}, {$set: {"services.resume.loginTokens": tmp}});
    }
  }
});
