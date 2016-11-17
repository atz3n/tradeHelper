var pageSession = new ReactiveDict();

Template.HomePrivate.rendered = function() {
	Session.set('activePage', 'prHome');
	Meteor.ClientCall.setClientId(Meteor.userId());

};

Template.HomePrivate.events({
	
});

Template.HomePrivate.helpers({

});




Template.HomePrivateView.rendered = function() {
	pageSession.set('Logins', '');
	Meteor.call('getLogins', function(e, r) { 
		if(e) console.log(e) 
		else pageSession.set('Logins', r);
	});

};

Template.HomePrivateView.events({
	"click #form-goToActives-button": function(e, t) {
    	e.preventDefault();

    	Router.go("actives", {});
    }
});

Template.HomePrivateView.helpers({
	logins: function() {
		return pageSession.get('Logins');
	},
	numOfLogins: function() {
		if(pageSession.get('Logins')) 
			return pageSession.get('Logins').length;
	}
});
