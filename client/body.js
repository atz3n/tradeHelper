var pageSession = new ReactiveDict();
var conf = '';
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
  'click button': function(event, instance) {

    /*++++++++++ createButton ++++++++++*/
    if ($(event.target).prop("name") == "createButton") {

      Meteor.call('create', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
      });

      /*++++++++++ setConfigButton ++++++++++*/
    } else if ($(event.target).prop("name") == "setConfigButton") {
      var tmp = {
        key: 'wlU3pt+2L6hFed161UN+YVDzh5cfTf5yJn4Yrar5NWzt7FM9jCfSkQBi',
        secret: '9rMBm3bbxJdLdM3bne7VG5w9w5UV7Uk/9sUaxt2CiTSuhkBXF1/5NG6MOW1S32EheJckhnVIJ0g2ll3KSYMvXQ==',
        pair: 'XETHZEUR'
      };
      
      Meteor.call('setConfig', tmp, function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
      });


      /*++++++++++ getConfigButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getConfigButton") {

      Meteor.call('getConfig', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getStatusButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getStatusButton") {

      Meteor.call('getStatus', function(error, result) {
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


      /*++++++++++ getAmountButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getAmountButton") {

      Meteor.call('getAmount', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getPriceButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getPriceButton") {

      Meteor.call('getPrice', function(error, result) {
        if (error) pageSession.set('error', JSON.stringify(error));
        else pageSession.set('info', JSON.stringify(result));
      });


      /*++++++++++ getActionPriceButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getActionPriceButton") {

      Meteor.call('getActionPrice', function(error, result) {
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
    conf = event.target.text.value;
    pageSession.set('info', event.target.text.value);
    event.target.text.value = '';
  }
});
