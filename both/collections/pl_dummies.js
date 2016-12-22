this.PlDummies = new Mongo.Collection("plDummies");

this.PlDummies.userCanInsert = function(userId, doc) {
	return true;
};

this.PlDummies.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlDummies.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
