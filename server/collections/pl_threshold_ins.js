PlThresholdIns.allow({
	insert: function (userId, doc) {
		return PlThresholdIns.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlThresholdIns.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlThresholdIns.userCanRemove(userId, doc);
	}
});

PlThresholdIns.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plThresholdIn';
	doc.actives = 0;
	
	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlThresholdIns.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlThresholdIns.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlThresholdIns.before.remove(function(userId, doc) {
	
});

PlThresholdIns.after.insert(function(userId, doc) {
	
});

PlThresholdIns.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlThresholdIns.after.remove(function(userId, doc) {
	
});
