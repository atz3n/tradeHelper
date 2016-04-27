Pluginbundles.allow({
	insert: function (userId, doc) {
		return Pluginbundles.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Pluginbundles.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Pluginbundles.userCanRemove(userId, doc);
	}
});

Pluginbundles.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Pluginbundles.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Pluginbundles.before.remove(function(userId, doc) {
	
});

Pluginbundles.after.insert(function(userId, doc) {
	
});

Pluginbundles.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Pluginbundles.after.remove(function(userId, doc) {
	
});
