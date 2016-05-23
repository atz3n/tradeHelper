Histories.allow({
	insert: function (userId, doc) {
		return Histories.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Histories.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Histories.userCanRemove(userId, doc);
	}
});

Histories.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Histories.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Histories.before.remove(function(userId, doc) {
	
});

Histories.after.insert(function(userId, doc) {
	
});

Histories.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Histories.after.remove(function(userId, doc) {
	
});
