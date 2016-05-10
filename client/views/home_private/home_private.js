Template.HomePrivate.rendered = function() {
	Meteor.ClientCall.setClientId(Settings.findOne().ownerId)
};

Template.HomePrivate.events({
	
});

Template.HomePrivate.helpers({
	
});
