var pageSession = new ReactiveDict();
var conf = '';
var config = {};

/***********************************************************************
  Helper Template
 ***********************************************************************/

Template.body.helpers({
  info: function() {
    return pageSession.get('info');
  },
  error: function() {
    return pageSession.get('error');
  }
});


/***********************************************************************
  Events Template
 ***********************************************************************/

Template.body.events({
  'click button': function(event) {

    // console.log(event)

    /*++++++++++ createButton ++++++++++*/
    if ($(event.target).prop("name") == "createButton") {

      Meteor.call('create', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
      });

      /*++++++++++ setConfigButton ++++++++++*/
    } else if ($(event.target).prop("name") == "setConfigButton") {
      config.id = '123456';
      config.name = 'devExKraken';
      config.pair = 'XETHZEUR';

      console.log(config);
      Meteor.call('setConfig', config, function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getConfigButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getConfigButton") {

      Meteor.call('getConfig', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getInfoButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getInfoButton") {

      Meteor.call('getInfo', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getPairUnitsButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getPairUnitsButton") {

      Meteor.call('getPairUnits', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getVolumeButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getVolumeButton") {

      Meteor.call('getVolume', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getPriceButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getPriceButton") {

      Meteor.call('getPrice', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getTradePriceButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getTradePriceButton") {

      Meteor.call('getTradePrice', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ updateButton ++++++++++*/
    } else if ($(event.target).prop("name") == "updateButton") {

      Meteor.call('update', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ sellButton ++++++++++*/
    } else if ($(event.target).prop("name") == "sellButton") {

      Meteor.call('sell', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ buyButton ++++++++++*/
    } else if ($(event.target).prop("name") == "buyButton") {

      Meteor.call('buy', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ stopTradeButton ++++++++++*/
    } else if ($(event.target).prop("name") == "stopTradeButton") {

      Meteor.call('stopTrade', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getInstInfoButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getInstInfoButton") {

      Meteor.call('getInstInfo', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getTradePairInfosButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getTradePairInfosButton") {

      Meteor.call('getTradePairInfos', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


    } else if ($(event.target).prop("name") == "getPositionsButton") {

      Meteor.call('getPositions', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


    } else {
      /* do nothing */
    }
  },

  'submit .input': function(event) {
    event.preventDefault();

    if (event.target.qAmount) {
      config.qAmount = event.target.qAmount.value;
      event.target.qAmount.value += '_';
      Meteor.setTimeout(function() {
        event.target.qAmount.value = config.qAmount;
      }, 200);
    }

    if (event.target.trAvVal) {
      config.trAvVal = event.target.trAvVal.value;
      event.target.trAvVal.value += '_';
      Meteor.setTimeout(function() {
        event.target.trAvVal.value = config.trAvVal;
      }, 200);
    }

    if (event.target.conErrorCycles) {
      config.conErrorCycles = event.target.conErrorCycles.value;
      event.target.conErrorCycles.value += '_';
      Meteor.setTimeout(function() {
        event.target.conErrorCycles.value = config.conErrorCycles;
      }, 200);
    }

    if (event.target.conErrorWaitTime) {
      config.conErrorWaitTime = event.target.conErrorWaitTime.value;
      event.target.conErrorWaitTime.value += '_';
      Meteor.setTimeout(function() {
        event.target.conErrorWaitTime.value = config.conErrorWaitTime;
      }, 200);
    }

    if (event.target.orderCheckWaitSec) {
      config.orderCheckWaitSec = event.target.orderCheckWaitSec.value;
      event.target.orderCheckWaitSec.value += '_';
      Meteor.setTimeout(function() {
        event.target.orderCheckWaitSec.value = config.orderCheckWaitSec;
      }, 200);
    }

    if (event.target.oBalanceAmount) {
      config.oBalanceAmount = event.target.oBalanceAmount.value;
      event.target.oBalanceAmount.value += '_';
      Meteor.setTimeout(function() {
        event.target.oBalanceAmount.value = config.oBalanceAmount;
      }, 200);
    }

    if (event.target.key) {
      config.key = event.target.key.value;
      event.target.key.value += '_';
      Meteor.setTimeout(function() {
        event.target.key.value = config.key;
      }, 200);
    }

    if (event.target.secret) {
      config.secret = event.target.secret.value;
      event.target.secret.value += '_';
      Meteor.setTimeout(function() {
        event.target.secret.value = config.secret;
      }, 200);
    }
  },

  'click input': function(event) {

    if ($(event.target).prop("name") == "hotMode") {
      config.hotMode = $(event.target).context.checked;
    }

    if ($(event.target).prop("name") == "orderType") {
      config.orderType = $(event.target).prop("value");
    }

    if ($(event.target).prop("name") == "qAmountType") {
      config.qAmountType = $(event.target).prop("value");
    }

    if ($(event.target).prop("name") == "priceType") {
      config.priceType = $(event.target).prop("value");
    }

    if ($(event.target).prop("name") == "trAvType") {
      config.trAvType = $(event.target).prop("value");
    }

    if ($(event.target).prop("name") == "balanceType") {
      config.balanceType = $(event.target).prop("value");
    }
  }
});
