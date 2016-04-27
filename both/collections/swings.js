this.Swings = new Mongo.Collection("swings");

this.Swings.userCanInsert = function(userId, doc) {
	return true;
};

this.Swings.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Swings.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
