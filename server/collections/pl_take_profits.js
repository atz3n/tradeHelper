PlTakeProfits.allow({
	insert: function (userId, doc) {
		return PlTakeProfits.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return PlTakeProfits.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return PlTakeProfits.userCanRemove(userId, doc);
	}
});

PlTakeProfits.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'plTakeProfit';
	doc.actives = 0;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

PlTakeProfits.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

PlTakeProfits.before.remove(function(userId, doc) {
	
});

PlTakeProfits.after.insert(function(userId, doc) {
	
});

PlTakeProfits.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

PlTakeProfits.after.remove(function(userId, doc) {
	
});
