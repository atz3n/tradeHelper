PlStopLosses.allow({
	insert: function (userId, doc) {
		return PlStopLosses.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlStopLosses.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlStopLosses.userCanRemove(userId, doc);
	}
});

PlStopLosses.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plStopLoss';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlStopLosses.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlStopLosses.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlStopLosses.before.remove(function(userId, doc) {
	
});

PlStopLosses.after.insert(function(userId, doc) {
	
});

PlStopLosses.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlStopLosses.after.remove(function(userId, doc) {
	
});
