this.ActiveDatas = new Mongo.Collection("activeDatas");

this.ActiveDatas.userCanInsert = function(userId, doc) {
	return true;
};

this.ActiveDatas.userCanUpdate = function(userId, doc) {
	return false;
};

this.ActiveDatas.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
