PlDummies.allow({
	insert: function (userId, doc) {
		return PlDummies.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlDummies.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlDummies.userCanRemove(userId, doc);
	}
});

PlDummies.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plDummy';
	doc.actives = 0;
	
	if(!doc.ownerId) doc.ownerId = userId;

});

PlDummies.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlDummies.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlDummies.before.remove(function(userId, doc) {
	
});

PlDummies.after.insert(function(userId, doc) {
	
});

PlDummies.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlDummies.after.remove(function(userId, doc) {
	
});
