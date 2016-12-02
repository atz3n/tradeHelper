this.PlThresholdOuts = new Mongo.Collection("plThresholdOuts");

this.PlThresholdOuts.userCanInsert = function(userId, doc) {
	return true;
};

this.PlThresholdOuts.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlThresholdOuts.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
