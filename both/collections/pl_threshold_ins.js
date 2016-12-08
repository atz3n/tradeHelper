this.PlThresholdIns = new Mongo.Collection("plThresholdIns");

this.PlThresholdIns.userCanInsert = function(userId, doc) {
	return true;
};

this.PlThresholdIns.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlThresholdIns.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
