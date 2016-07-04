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


    } else {
      /* do nothing */
    }
  },

  'submit .input': function(event) {
    event.preventDefault();

    if (event.target.balanceAmount) {
      config.balanceAmount = event.target.balanceAmount.value;
      event.target.balanceAmount.value += '_';
      Meteor.setTimeout(function() {
        event.target.balanceAmount.value = config.balanceAmount;
      }, 200);
    }

    if (event.target.data) {
      config.data = event.target.data.value;
      event.target.data.value += '_';
      Meteor.setTimeout(function() {
        event.target.data.value = config.data;
      }, 200);
    }

    if (event.target.startVal) {
      config.startVal = event.target.startVal.value;
      event.target.startVal.value += '_';
      Meteor.setTimeout(function() {
        event.target.startVal.value = config.startVal;
      }, 200);
    }

    if (event.target.gain) {
      config.gain = event.target.gain.value;
      event.target.gain.value += '_';
      Meteor.setTimeout(function() {
        event.target.gain.value = config.gain;
      }, 200);
    }

    if (event.target.offset) {
      config.offset = event.target.offset.value;
      event.target.offset.value += '_';
      Meteor.setTimeout(function() {
        event.target.offset.value = config.offset;
      }, 200);
    }

    if (event.target.stepWidth) {
      config.stepWidth = event.target.stepWidth.value;
      event.target.stepWidth.value += '_';
      Meteor.setTimeout(function() {
        event.target.stepWidth.value = config.stepWidth;
      }, 200);
    }

    if (event.target.tradeDelaySec) {
      config.tradeDelaySec = event.target.tradeDelaySec.value;
      event.target.tradeDelaySec.value += '_';
      Meteor.setTimeout(function() {
        event.target.tradeDelaySec.value = config.tradeDelaySec;
      }, 200);
    }
  },

  'click input': function(event) {

    if ($(event.target).prop("name") == "priceType") {
      config.priceType = $(event.target).context.checked;
    }
  }
});
