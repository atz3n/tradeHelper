this.Topics = new Mongo.Collection("topics");

this.Topics.userCanInsert = function(userId, doc) {
	return true;
};

this.Topics.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Topics.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
