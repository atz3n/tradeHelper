this.Settings = new Mongo.Collection("settings");

this.Settings.userCanInsert = function(userId, doc) {
	return true;
};

this.Settings.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Settings.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
