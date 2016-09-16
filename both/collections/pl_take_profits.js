this.PlTakeProfits = new Mongo.Collection("plTakeProfits");

this.PlTakeProfits.userCanInsert = function(userId, doc) {
	return true;
};

this.PlTakeProfits.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlTakeProfits.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
