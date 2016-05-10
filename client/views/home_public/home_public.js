Template.HomePublic.rendered = function() {

};

Template.HomePublic.events({
  'click button': function(event, instance) {

    /*++++++++++ startButton ++++++++++*/
    if ($(event.target).prop("name") == "dummyButton") {

      alert('dummy button pressed')
    }
  }
});

Template.HomePublic.helpers({

});
