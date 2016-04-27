TestDatas.allow({
	insert: function (userId, doc) {
		return TestDatas.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return TestDatas.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return TestDatas.userCanRemove(userId, doc);
	}
});

TestDatas.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

TestDatas.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

TestDatas.before.remove(function(userId, doc) {
	
});

TestDatas.after.insert(function(userId, doc) {
	
});

TestDatas.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

TestDatas.after.remove(function(userId, doc) {
	
});
