var pageSession = new ReactiveDict();


Template.Playground.rendered = function() {
  Meteor.ClientCall.setClientId(Meteor.userId());

  var temp = Strategies.find().fetch();
  for (i = 0; i < temp.length; i++) {

    Meteor.call("getStrategyData",temp[i]._id, function(e, r) {
      if (e) console.log(e);
      else globalReact.set("updateInfos", r);
    });
  };
};


var cnt = 0;
Template.Playground.events({
  'click button': function(event, instance) {

    /*++++++++++ startButton ++++++++++*/
    if ($(event.target).prop("name") == "startButton") {

      var temp = Strategies.find().fetch();
      for (i = 0; i < temp.length; i++) {

        Meteor.call("strategyStart", temp[i]._id, function(e) {
          if (e) console.log(e);
        });
      };


      /*++++++++++ pauseButton ++++++++++*/
    } else if ($(event.target).prop("name") == "pauseButton") {

      var temp = Strategies.find().fetch();
      for (i = 0; i < temp.length; i++) {
        Meteor.call("strategyPause", temp[i]._id, function(e) {
          if (e) console.log(e);
        });
      };


      /*++++++++++ stopButton ++++++++++*/
    } else if ($(event.target).prop("name") == "stopButton") {

      var temp = Strategies.find().fetch();
      for (i = 0; i < temp.length; i++) {
        Meteor.call("strategyStop", temp[i]._id, function(e) {
          if (e) console.log(e);
        });
      };


      /*++++++++++ dummyButton ++++++++++*/
    } else if ($(event.target).prop("name") == "dummyButton") {
      cnt++;
      Meteor.call("develop", function(e) {
        if (e) console.log(e);
      });

    }
  }
});

Template.Playground.helpers({
  text: function() {
    return JSON.stringify(globalReact.get("updateInfos"));
    // return globalReact.get("updateInfos").prices[0].price;
    // return pageSession.get("text");
  }
});
