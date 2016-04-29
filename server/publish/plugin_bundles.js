Meteor.publish("pluginbundles", function() {
	return PluginBundles.find({ownerId:this.userId}, {});
});

Meteor.publish("pluginbundles_empty", function() {
	return PluginBundles.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pluginbundle", function(pluginbundleId) {
	return PluginBundles.find({_id:pluginbundleId,ownerId:this.userId}, {});
});

