PlProfitLineStopOuts.allow({
	insert: function (userId, doc) {
		return PlProfitLineStopOuts.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlProfitLineStopOuts.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlProfitLineStopOuts.userCanRemove(userId, doc);
	}
});

PlProfitLineStopOuts.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plProfitLineStopOut';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlProfitLineStopOuts.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlProfitLineStopOuts.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

PlProfitLineStopOuts.before.remove(function(userId, doc) {
	
});

PlProfitLineStopOuts.after.insert(function(userId, doc) {
	
});

PlProfitLineStopOuts.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlProfitLineStopOuts.after.remove(function(userId, doc) {
	
});
