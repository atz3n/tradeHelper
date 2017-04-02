this.PlProfitLineStopOuts = new Mongo.Collection("plProfitLineStopOuts");

this.PlProfitLineStopOuts.userCanInsert = function(userId, doc) {
	return true;
};

this.PlProfitLineStopOuts.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlProfitLineStopOuts.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
