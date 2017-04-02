this.PlTrailingStopIns = new Mongo.Collection("plTrailingStopIns");

this.PlTrailingStopIns.userCanInsert = function(userId, doc) {
	return true;
};

this.PlTrailingStopIns.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlTrailingStopIns.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
