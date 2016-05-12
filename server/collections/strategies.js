Strategies.allow({
	insert: function (userId, doc) {
		return Strategies.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Strategies.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Strategies.userCanRemove(userId, doc);
	}
});

Strategies.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.active = false;
	doc.paused = false;
	
	if(!doc.ownerId) doc.ownerId = userId;
});

Strategies.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Strategies.before.remove(function(userId, doc) {
	ActiveDatas.remove({strategyId: doc._id});
});

Strategies.after.insert(function(userId, doc) {
	
});

Strategies.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Strategies.after.remove(function(userId, doc) {
	
});
