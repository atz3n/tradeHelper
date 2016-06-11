PluginBundles.allow({
	insert: function (userId, doc) {
		return PluginBundles.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PluginBundles.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PluginBundles.userCanRemove(userId, doc);
	}
});

PluginBundles.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.actives = 0;
	
	
	if(!doc.ownerId) doc.ownerId = userId;
});

PluginBundles.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PluginBundles.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PluginBundles.before.remove(function(userId, doc) {
	
});

PluginBundles.after.insert(function(userId, doc) {
	
});

PluginBundles.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PluginBundles.after.remove(function(userId, doc) {
	
});
