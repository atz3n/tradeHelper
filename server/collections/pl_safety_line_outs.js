PlSafetyLineOuts.allow({
	insert: function (userId, doc) {
		return PlSafetyLineOuts.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlSafetyLineOuts.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlSafetyLineOuts.userCanRemove(userId, doc);
	}
});

PlSafetyLineOuts.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plSafetyLineOut';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlSafetyLineOuts.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlSafetyLineOuts.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlSafetyLineOuts.before.remove(function(userId, doc) {
	
});

PlSafetyLineOuts.after.insert(function(userId, doc) {
	
});

PlSafetyLineOuts.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlSafetyLineOuts.after.remove(function(userId, doc) {
	
});
