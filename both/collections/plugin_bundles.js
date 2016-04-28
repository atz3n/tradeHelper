this.PluginBundles = new Mongo.Collection("pluginBundles");

this.PluginBundles.userCanInsert = function(userId, doc) {
	return true;
};

this.PluginBundles.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PluginBundles.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
