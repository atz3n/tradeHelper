Meteor.publish("pluginbundles", function(strategyId) {
	return Pluginbundles.find({strategyId:strategyId,ownerId:this.userId}, {});
});

Meteor.publish("pluginbundles_empty", function() {
	return Pluginbundles.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pluginbundle", function(pluginbundleId) {
	return Pluginbundles.find({_id:pluginbundleId,ownerId:this.userId}, {});
});

