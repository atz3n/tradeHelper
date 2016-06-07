Template.HomePrivate.rendered = function() {
	Session.set('activePage', 'prHome');
	Meteor.ClientCall.setClientId(Meteor.userId());
};

Template.HomePrivate.events({
	
});

Template.HomePrivate.helpers({
	
});
