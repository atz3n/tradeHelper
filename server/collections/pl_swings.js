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
	doc.type = 'plSwing';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlSwings.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlSwings.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlSwings.before.remove(function(userId, doc) {
	
});

PlSwings.after.insert(function(userId, doc) {
	
});

PlSwings.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlSwings.after.remove(function(userId, doc) {
	
});
