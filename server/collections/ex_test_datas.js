ExTestDatas.allow({
	insert: function (userId, doc) {
		return ExTestDatas.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return ExTestDatas.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return ExTestDatas.userCanRemove(userId, doc);
	}
});

ExTestDatas.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
	doc.type = 'exTestData';

	
	if(!doc.ownerId) doc.ownerId = userId;
});

ExTestDatas.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

ExTestDatas.before.remove(function(userId, doc) {
	
});

ExTestDatas.after.insert(function(userId, doc) {
	
});

ExTestDatas.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

ExTestDatas.after.remove(function(userId, doc) {
	
});
