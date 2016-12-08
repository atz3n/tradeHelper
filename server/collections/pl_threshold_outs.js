PlThresholdOuts.allow({
	insert: function (userId, doc) {
		return PlThresholdOuts.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlThresholdOuts.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlThresholdOuts.userCanRemove(userId, doc);
	}
});

PlThresholdOuts.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plThresholdOut';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlThresholdOuts.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlThresholdOuts.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlThresholdOuts.before.remove(function(userId, doc) {
	
});

PlThresholdOuts.after.insert(function(userId, doc) {
	
});

PlThresholdOuts.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlThresholdOuts.after.remove(function(userId, doc) {
	
});
