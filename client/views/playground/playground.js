var pageSession = new ReactiveDict();


Template.Playground.rendered = function() {
  Session.set('activePage', 'playground');
};


var cnt = 0;
testCol = new Mongo.Collection(null);

Template.Playground.events({
  'click button': function(event, instance) {

    /*++++++++++ startButton ++++++++++*/
    if ($(event.target).prop("name") == "startButton") {
      // testCol.insert('')

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
  }
});
