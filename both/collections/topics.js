this.Topics = new Mongo.Collection("topics");

this.Topics.userCanInsert = function(userId, doc) {
	return true;
};

this.Topics.userCanUpdate = function(userId, doc) {
	return getUserRole(userId) == 'developer' || getUserRole(userId) == 'admin';
};

this.Topics.userCanRemove = function(userId, doc) {
	return getUserRole(userId) == 'developer' || getUserRole(userId) == 'admin';
};
