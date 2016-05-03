var pageSession = new ReactiveDict();
pageSession.set("text", "empty");
Template.Playground.rendered = function() {

};

Template.Playground.events({
  'click button': function(event, instance) {

    /*++++++++++ startButton ++++++++++*/
    if ($(event.target).prop("name") == "startButton") {

      var temp = Strategies.find().fetch();
      for (i = 0; i < temp.length; i++) {

        Meteor.call("startStrategy", temp[i]._id, function(e) {
          if (e) console.log(e);
        });
      };


      /*++++++++++ pauseButton ++++++++++*/
    } else if ($(event.target).prop("name") == "pauseButton") {

      var temp = Strategies.find().fetch();
      for (i = 0; i < temp.length; i++) {
        Meteor.call("pauseStrategy", temp[i]._id, function(e) {
          if (e) console.log(e);
        });
      };


      /*++++++++++ stopButton ++++++++++*/
    } else if ($(event.target).prop("name") == "stopButton") {

      var temp = Strategies.find().fetch();
      for (i = 0; i < temp.length; i++) {
        Meteor.call("stopStrategy", temp[i]._id, function(e) {
          if (e) console.log(e);
        });
      };


      /*++++++++++ dummyButton ++++++++++*/
    } else if ($(event.target).prop("name") == "dummyButton") {

      Meteor.call("strategyDevelop", function(e) {
        if (e) console.log(e);
      });

    }
  }
});

Template.Playground.helpers({
  text: function() {
    return pageSession.get("text");
  }
});
