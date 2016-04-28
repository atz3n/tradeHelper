this.ExTestDatas = new Mongo.Collection("exTestDatas");

this.ExTestDatas.userCanInsert = function(userId, doc) {
	return true;
};

this.ExTestDatas.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.ExTestDatas.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
