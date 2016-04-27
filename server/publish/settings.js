Meteor.publish("settings", function() {
	return Settings.find({ownerId:this.userId}, {});
});

Meteor.publish("settings_empty", function() {
	return Settings.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("settings_first", function() {
	return Settings.find({ownerId:this.userId}, {});
});

Meteor.publish("setting", function(settingId) {
	return Settings.find({_id:settingId,ownerId:this.userId}, {});
});

