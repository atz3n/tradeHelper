PlTrailingStopOuts.allow({
	insert: function (userId, doc) {
		return PlTrailingStopOuts.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlTrailingStopOuts.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlTrailingStopOuts.userCanRemove(userId, doc);
	}
});

PlTrailingStopOuts.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plTrailingStopOut';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlTrailingStopOuts.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlTrailingStopOuts.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlTrailingStopOuts.before.remove(function(userId, doc) {
	
});

PlTrailingStopOuts.after.insert(function(userId, doc) {
	
});

PlTrailingStopOuts.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlTrailingStopOuts.after.remove(function(userId, doc) {
	
});
