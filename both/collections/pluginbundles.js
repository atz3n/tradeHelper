this.Pluginbundles = new Mongo.Collection("pluginbundles");

this.Pluginbundles.userCanInsert = function(userId, doc) {
	return true;
};

this.Pluginbundles.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Pluginbundles.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
