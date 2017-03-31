this.PlSafetyLineOuts = new Mongo.Collection("plSafetyLineOuts");

this.PlSafetyLineOuts.userCanInsert = function(userId, doc) {
	return true;
};

this.PlSafetyLineOuts.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlSafetyLineOuts.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
