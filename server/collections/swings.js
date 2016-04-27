Swings.allow({
	insert: function (userId, doc) {
		return Swings.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Swings.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Swings.userCanRemove(userId, doc);
	}
});

Swings.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Swings.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Swings.before.remove(function(userId, doc) {
	
});

Swings.after.insert(function(userId, doc) {
	
});

Swings.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Swings.after.remove(function(userId, doc) {
	
});
