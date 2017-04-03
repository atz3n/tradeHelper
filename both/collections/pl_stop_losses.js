this.PlStopLossOutes = new Mongo.Collection("plStopLossOutes");

this.PlStopLossOutes.userCanInsert = function(userId, doc) {
	return true;
};

this.PlStopLossOutes.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlStopLossOutes.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
