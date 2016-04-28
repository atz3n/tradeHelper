this.ExKrakens = new Mongo.Collection("exKrakens");

this.ExKrakens.userCanInsert = function(userId, doc) {
	return true;
};

this.ExKrakens.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.ExKrakens.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
