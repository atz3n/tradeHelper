this.PlStopLosses = new Mongo.Collection("plStopLosses");

this.PlStopLosses.userCanInsert = function(userId, doc) {
	return true;
};

this.PlStopLosses.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlStopLosses.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
