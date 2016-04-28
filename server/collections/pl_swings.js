PlSwings.allow({
	insert: function (userId, doc) {
		return PlSwings.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlSwings.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlSwings.userCanRemove(userId, doc);
	}
});

PlSwings.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlSwings.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlSwings.before.remove(function(userId, doc) {
	
});

PlSwings.after.insert(function(userId, doc) {
	
});

PlSwings.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlSwings.after.remove(function(userId, doc) {
	
});
