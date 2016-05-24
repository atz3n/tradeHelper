this.Histories = new Mongo.Collection("histories");

this.Histories.userCanInsert = function(userId, doc) {
	return false;
};

this.Histories.userCanUpdate = function(userId, doc) {
	return false;
};

this.Histories.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
