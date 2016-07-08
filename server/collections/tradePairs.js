TradePairs.allow({
	insert: function (userId, doc) {
		return TradePairs.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return TradePairs.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return TradePairs.userCanRemove(userId, doc);
	}
});

TradePairs.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
});

TradePairs.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;
});

TradePairs.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;
});

TradePairs.before.remove(function(userId, doc) {
	
});

TradePairs.after.insert(function(userId, doc) {
	
});

TradePairs.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

TradePairs.after.remove(function(userId, doc) {
	
});