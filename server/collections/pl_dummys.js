PlDummys.allow({
	insert: function (userId, doc) {
		return PlDummys.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlDummys.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlDummys.userCanRemove(userId, doc);
	}
});

PlDummys.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plDummy';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlDummys.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlDummys.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlDummys.before.remove(function(userId, doc) {
	
});

PlDummys.after.insert(function(userId, doc) {
	
});

PlDummys.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlDummys.after.remove(function(userId, doc) {
	
});
