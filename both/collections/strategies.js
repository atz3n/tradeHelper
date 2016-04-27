this.Strategies = new Mongo.Collection("strategies");

this.Strategies.userCanInsert = function(userId, doc) {
	return true;
};

this.Strategies.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Strategies.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
