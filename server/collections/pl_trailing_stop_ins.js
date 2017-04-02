PlTrailingStopIns.allow({
	insert: function (userId, doc) {
		return PlTrailingStopIns.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlTrailingStopIns.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlTrailingStopIns.userCanRemove(userId, doc);
	}
});

PlTrailingStopIns.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plTrailingStopIn';
	doc.actives = 0;
	
	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlTrailingStopIns.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlTrailingStopIns.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlTrailingStopIns.before.remove(function(userId, doc) {
	
});

PlTrailingStopIns.after.insert(function(userId, doc) {
	
});

PlTrailingStopIns.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlTrailingStopIns.after.remove(function(userId, doc) {
	
});
