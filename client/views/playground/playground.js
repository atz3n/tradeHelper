var pageSession = new ReactiveDict();


Template.Playground.rendered = function() {
  Session.set('activePage', 'playground');
  // Meteor.ClientCall.setClientId(Meteor.userId());

  var temp = Strategies.find().fetch();
  for (i = 0; i < temp.length; i++) {

    Meteor.call("strategyGetData",temp[i]._id, function(e, r) {
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


      /*++++++++++ pauseButton ++++++++++*/
    } else if ($(event.target).prop("name") == "pauseButton") {



      /*++++++++++ stopButton ++++++++++*/
    } else if ($(event.target).prop("name") == "stopButton") {



      /*++++++++++ dummyButton ++++++++++*/
    } else if ($(event.target).prop("name") == "dummyButton") {
      // new Audio('/sounds/Electronic_Chime-KevanGC.mp3');
      new buzz.sound('sounds/Electronic_Chime-KevanGC.mp3').play();
      // var s = new buzz.sound('sounds/Electronic_Chime-KevanGC.mp3');
      // var s = new buzz.sound('sounds/truck.ogg');
      s.play();
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
