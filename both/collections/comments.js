this.Comments = new Mongo.Collection("comments");

this.Comments.userCanInsert = function(userId, doc) {
	return false;
};

this.Comments.userCanUpdate = function(userId, doc) {
	return true;
};

this.Comments.userCanRemove = function(userId, doc) {
	return getUserRole(userId) == 'developer' || getUserRole(userId) == 'admin';
};
