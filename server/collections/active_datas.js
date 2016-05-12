ActiveDatas.allow({
	insert: function (userId, doc) {
		return ActiveDatas.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return ActiveDatas.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return ActiveDatas.userCanRemove(userId, doc);
	}
});

ActiveDatas.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

ActiveDatas.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

ActiveDatas.before.remove(function(userId, doc) {
	
});

ActiveDatas.after.insert(function(userId, doc) {
	
});

ActiveDatas.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

ActiveDatas.after.remove(function(userId, doc) {
	
});
