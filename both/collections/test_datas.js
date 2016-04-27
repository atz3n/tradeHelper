this.TestDatas = new Mongo.Collection("testDatas");

this.TestDatas.userCanInsert = function(userId, doc) {
	return true;
};

this.TestDatas.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.TestDatas.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
