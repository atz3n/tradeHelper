Meteor.subscribe("settings_first");


Meteor.ClientCall.methods({

	notification: function(infos){
	
		if(Settings.findOne().enNotification == true){
			alert(infos);
		}
		return true;
	},

});