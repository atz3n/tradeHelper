import { Strategy } from '../trading/strategy/Strategy.js';
import { InstHandler } from '../lib/InstHandler.js';

strategies = new InstHandler();

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
  // console.log(errObj)
    /* to search as less as possible for the ownerId */
  if (sStrIdNfy !== strategyId) {
    sOIdNfy = Strategies.findOne({ _id: strategyId }).ownerId;
    sStrIdNfy = strategyId;
  }
  Meteor.ClientCall.apply(sOIdNfy, 'error', [errMessage(errObj, strategyId)], function(error, result) {});
}


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

  return errHandle('error', 'Sorry, an unknown error occurred!');
}



Meteor.methods({

  strategyStart: function(strategyId) {
    var tmp = start(strategyId);

    if (tmp.error !== StrError.ok) {
      stop(strategyId);
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

  develop: function(strategyId) {
    console.log(strategyId);
    if (strategies.getObject(strategyId) !== 'undefined') {
      console.log(JSON.stringify(strategies.getObject(strategyId).inst.develop()))
    }
  }
});
