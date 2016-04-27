this.Dummys = new Mongo.Collection("dummys");

this.Dummys.userCanInsert = function(userId, doc) {
	return true;
};

this.Dummys.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Dummys.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
