import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './body.html';


/***********************************************************************
  Private Function
 ***********************************************************************/

export var test = new ReactiveVar('init');


/***********************************************************************
  OnCreate Template
 ***********************************************************************/

Template.body.onCreated(function helloOnCreated() {
  this.pairValue = new ReactiveVar('init');
  this.highValue = new ReactiveVar('init');
  this.freezedValue = new ReactiveVar('init');
  this.lowValue = new ReactiveVar('init');
  this.currValue = test;
  // this.currValue = new ReactiveVar('init');
  this.pDiffValue = new ReactiveVar('init');
  this.aDiffValue = new ReactiveVar('init');
});


/***********************************************************************
  Helper Template
 ***********************************************************************/

Template.body.helpers({
  pairValue: function() {
    return Template.instance().pairValue.get();
  },
  highValue: function() {
    return Template.instance().highValue.get();
  },
  freezedValue: function() {
    return Template.instance().freezedValue.get();
  },
  lowValue: function() {
    return Template.instance().lowValue.get();
  },
  currValue: function() {
    return Template.instance().currValue.get();
  },
  pDiffValue: function() {
    return Template.instance().pDiffValue.get();
  },
  aDiffValue: function() {
    return Template.instance().aDiffValue.get();
  }
});


/***********************************************************************
  Events Template
 ***********************************************************************/

Template.body.events({
  'click button': function(event, instance) {
    
    /*++++++++++ buyButton ++++++++++*/
    if ($(event.target).prop("name") == "buyButton") {
    
      Meteor.call('getKrakenAssetPairs', function(error, response) {
        if(response == 'krakenApiError'){
          instance.pairValue.set('error');
          return;
        }
        
        var jsonVal = JSON.parse(response);

        instance.pairValue.set('');        

        var keys = Object.keys(jsonVal.result);
        var temp = '';
        for (var i = 0; i < keys.length; i++) {
          temp+=  keys[i] + '\n';        
        };

        instance.pairValue.set(temp);
      });

      instance.freezedValue.set('buyButton pressed');



    /*++++++++++ sellButton ++++++++++*/
    } else if ($(event.target).prop("name") == "sellButton") {

      Meteor.call('getKrakenTimeStamp', 'rfc', function(error, response) {
        if(response == 'krakenApiError'){
          instance.highValue.set('error');
          return;
        }

        instance.highValue.set(response);
      });

      instance.freezedValue.set('sellButton pressed');



    /*++++++++++ setButton ++++++++++*/
    } else if ($(event.target).prop("name") == "setButton") {

      Meteor.call('getKrakenTimeStamp', 'unix', function(error, response) {
        if(response == 'krakenApiError'){
          instance.highValue.set('error');
          return;
        }

        instance.highValue.set(response);
      });

      instance.freezedValue.set('setButton pressed');



    /*++++++++++ resetButton ++++++++++*/
    } else if ($(event.target).prop("name") == "resetButton") {
      Meteor.call('srvClbk_getData', function(error, response){
        instance.lowValue.set(response);
      })

      // Meteor.call('getKrakenTickerInfo');
      // Meteor.call('getKrakenTickerInfo', function(error, response) {
      //   console.log(response);
      //   console.log(error);

      //   instance.PercDiff.set(response);
      // });
      
      instance.freezedValue.set('resetButton pressed');

    /*++++++++++ default ++++++++++*/
    } else {
      /* do something */
    }
  }
});







// import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';
//
// import './main.html';
//
// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });
//
// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });
//
// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });
