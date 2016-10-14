Comments.allow({
	insert: function (userId, doc) {
		return Comments.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Comments.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Comments.userCanRemove(userId, doc);
	}
});

Comments.before.insert(function(userId, doc) {

	/* adding comments array */
	doc.comments = [];

	if(!doc.ownerId) doc.ownerId = userId;
});

Comments.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Comments.before.remove(function(userId, doc) {
	
});

Comments.after.insert(function(userId, doc) {
	
});

Comments.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Comments.after.remove(function(userId, doc) {
	
});
