Meteor.publish("pluginbundles", function(strategyId) {
	return PluginBundles.find({strategyId:strategyId,ownerId:this.userId}, {});
});

Meteor.publish("pluginbundles_empty", function() {
	return PluginBundles.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pluginbundle", function(pluginbundleId) {
	return PluginBundles.find({_id:pluginbundleId,ownerId:this.userId}, {});
});

