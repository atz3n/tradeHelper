PlStopLossOutes.allow({
	insert: function (userId, doc) {
		return PlStopLossOutes.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlStopLossOutes.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlStopLossOutes.userCanRemove(userId, doc);
	}
});

PlStopLossOutes.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plStopLossOut';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlStopLossOutes.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlStopLossOutes.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlStopLossOutes.before.remove(function(userId, doc) {
	
});

PlStopLossOutes.after.insert(function(userId, doc) {
	
});

PlStopLossOutes.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlStopLossOutes.after.remove(function(userId, doc) {
	
});
