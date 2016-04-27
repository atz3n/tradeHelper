this.Krakens = new Mongo.Collection("krakens");

this.Krakens.userCanInsert = function(userId, doc) {
	return true;
};

this.Krakens.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Krakens.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
