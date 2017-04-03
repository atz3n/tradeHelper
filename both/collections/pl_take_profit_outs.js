this.PlTakeProfitOuts = new Mongo.Collection("plTakeProfitOuts");

this.PlTakeProfitOuts.userCanInsert = function(userId, doc) {
	return true;
};

this.PlTakeProfitOuts.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.PlTakeProfitOuts.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
