this.TradePairs = new Mongo.Collection("tradePairs");

this.TradePairs.userCanInsert = function(userId, doc) {
	return false;
};

this.TradePairs.userCanUpdate = function(userId, doc) {
	return false;
};

this.TradePairs.userCanRemove = function(userId, doc) {
	return false;
};
