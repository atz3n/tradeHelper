Settings.allow({
	insert: function (userId, doc) {
		return Settings.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Settings.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Settings.userCanRemove(userId, doc);
	}
});

Settings.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Settings.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Settings.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

Settings.before.remove(function(userId, doc) {
	
});

Settings.after.insert(function(userId, doc) {
	
});

Settings.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Settings.after.remove(function(userId, doc) {
	
});
