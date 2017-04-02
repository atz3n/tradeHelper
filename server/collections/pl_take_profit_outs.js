PlTakeProfitOuts.allow({
	insert: function (userId, doc) {
		return PlTakeProfitOuts.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlTakeProfitOuts.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlTakeProfitOuts.userCanRemove(userId, doc);
	}
});

PlTakeProfitOuts.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plTakeProfitOut';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlTakeProfitOuts.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlTakeProfitOuts.before.remove(function(userId, doc) {
	
});

PlTakeProfitOuts.after.insert(function(userId, doc) {
	
});

PlTakeProfitOuts.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlTakeProfitOuts.after.remove(function(userId, doc) {
	
});
