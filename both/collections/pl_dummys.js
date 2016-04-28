this.PlDummys = new Mongo.Collection("plDummys");

this.PlDummys.userCanInsert = function(userId, doc) {
	return true;
};

this.PlDummys.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlDummys.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
