this.PlTrailingStopOuts = new Mongo.Collection("plTrailingStopOuts");

this.PlTrailingStopOuts.userCanInsert = function(userId, doc) {
	return true;
};

this.PlTrailingStopOuts.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlTrailingStopOuts.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
