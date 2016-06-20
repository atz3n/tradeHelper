var pageSession = new ReactiveDict();

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
    
    /*++++++++++ setConfigButton ++++++++++*/
    if ($(event.target).prop("name") == "createButton") {

      Meteor.call('create', function (error, result) {
        if(error) pageSession.set('error', error);
      });

    /*++++++++++ setConfigButton ++++++++++*/
    } else if ($(event.target).prop("name") == "setConfigButton") {

      Meteor.call('setConfig', 1, function (error, result) {
        if(error) pageSession.set('error', error);
      });


    /*++++++++++ getConfigButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getConfigButton") {

      Meteor.call('getConfig', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    /*++++++++++ getStatusButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getStatusButton") {

      Meteor.call('getStatus', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    /*++++++++++ getInfoButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getInfoButton") {

      Meteor.call('getInfo', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    /*++++++++++ getPairUnitsButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getPairUnitsButton") {

      Meteor.call('getPairUnits', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    /*++++++++++ getAmountButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getAmountButton") {

      Meteor.call('getAmount', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    /*++++++++++ getPriceButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getPriceButton") {

      Meteor.call('getPrice', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    /*++++++++++ getActionPriceButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getActionPriceButton") {

      Meteor.call('getActionPrice', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    /*++++++++++ updateButton ++++++++++*/
    } else if ($(event.target).prop("name") == "updateButton") {

      Meteor.call('update', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    /*++++++++++ sellButton ++++++++++*/
    } else if ($(event.target).prop("name") == "sellButton") {

      Meteor.call('sell', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    /*++++++++++ buyButton ++++++++++*/
    } else if ($(event.target).prop("name") == "buyButton") {

      Meteor.call('buy', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    /*++++++++++ getInstInfoButton ++++++++++*/
    } else if ($(event.target).prop("name") == "getInstInfoButton") {

      Meteor.call('getInstInfo', function (error, result) {
        if(error) pageSession.set('error', error);
        else pageSession.set('info', result);
      });


    } else {
      /* do nothing */
    }
  },
  'submit .input': function(event){
    event.preventDefault();
    pageSession.set('info', event.target.text.value);
    event.target.text.value = '';
  }
});

