Dummys.allow({
	insert: function (userId, doc) {
		return Dummys.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Dummys.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Dummys.userCanRemove(userId, doc);
	}
});

Dummys.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Dummys.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Dummys.before.remove(function(userId, doc) {
	
});

Dummys.after.insert(function(userId, doc) {
	
});

Dummys.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Dummys.after.remove(function(userId, doc) {
	
});
