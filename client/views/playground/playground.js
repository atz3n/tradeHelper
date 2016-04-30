var pageSession = new ReactiveDict();
pageSession.set("text", "empty");
Template.Playground.rendered = function() {

};

Template.Playground.events({
    'click button': function(event, instance) {

        /*++++++++++ startButton ++++++++++*/
        if ($(event.target).prop("name") == "startButton") {
            Meteor.call("startStrategy", Strategies.findOne({})._id,  function(e) {
                if (e)
                    console.log(e);
                else
                    console.log("worked");
            });



            /*++++++++++ stopButton ++++++++++*/
        } else if ($(event.target).prop("name") == "stopButton") {




            /*++++++++++ resetButton ++++++++++*/
        } else if ($(event.target).prop("name") == "resetButton") {




            /*++++++++++ dummyButton ++++++++++*/
        } else if ($(event.target).prop("name") == "dummyButton") {



        }
    }
});

Template.Playground.helpers({
    text: function() {
        return pageSession.get("text");
    }
});
