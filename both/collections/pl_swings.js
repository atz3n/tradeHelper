this.PlSwings = new Mongo.Collection("plSwings");

this.PlSwings.userCanInsert = function(userId, doc) {
	return true;
};

this.PlSwings.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlSwings.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
