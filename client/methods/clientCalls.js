

Meteor.subscribe("settings_first");
globalReact.set('updateInfos', 'none');



Meteor.ClientCall.methods({

	notification: function(infos){
	
		if(Settings.findOne().enNotification == true){
			alert(infos);
		}
		return true;
	},

	update: function(infos){
		globalReact.set('updateInfos', infos);
		console.log(infos)
		return true;
	}

});