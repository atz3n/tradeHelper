ExKrakens.allow({
	insert: function (userId, doc) {
		return ExKrakens.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return ExKrakens.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return ExKrakens.userCanRemove(userId, doc);
	}
});

ExKrakens.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'exKraken';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

ExKrakens.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

ExKrakens.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

ExKrakens.before.remove(function(userId, doc) {
	
});

ExKrakens.after.insert(function(userId, doc) {
	
});

ExKrakens.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

ExKrakens.after.remove(function(userId, doc) {
	
});
