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
	},
  showLogins: function() {
    return pageSession.get("showLogins");
  },
});




Template.HomePrivateViewLogin.rendered = function() {
};

Template.HomePrivateViewLogin.events({
	"click #logout-button": function(e, t) {
    e.preventDefault();
    var me = this;
    bootbox.dialog({
      message: "Logout? Are you sure?",
      title: "Logout",
      animate: false,
      buttons: {
        success: {
          label: "Yes",
          className: "btn-success",
          callback: function() {
            Meteor.call('logoutEntity', me.login, function(e, r) {
              if (e) console.log(e);
              else(Template.HomePrivateView.rendered())
            });
          }
        },
        danger: {
          label: "No",
          className: "btn-default"
        }
      }
    });
    return false;
  },
});

Template.HomePrivateViewLogin.helpers({

});



Template.HomePrivateViewLoginsFieldButton.rendered = function() {
};

Template.HomePrivateViewLoginsFieldButton.events({
  "click #form-entity-button": function(e, t) {
    e.preventDefault();
    if(pageSession.get('showLogins') !== true)
      pageSession.set('showLogins', true);
    else
      pageSession.set('showLogins', false);
  }});

Template.HomePrivateViewLoginsFieldButton.helpers({
    "showLogins": function() {
    return pageSession.get("showLogins");
  }
});


