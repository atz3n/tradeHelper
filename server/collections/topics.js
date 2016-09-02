Topics.allow({
	insert: function (userId, doc) {
		return Topics.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Topics.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Topics.userCanRemove(userId, doc);
	}
});

Topics.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;


	var tpCnt = ServerDatas.findOne().topicCounter;
	doc.topicNum = '#' + tpCnt;
	
	tpCnt++;
	ServerDatas.update({_id: serverDataId}, { $set: { topicCounter: tpCnt } })

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Topics.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Topics.before.remove(function(userId, doc) {
	
});

Topics.after.insert(function(userId, doc) {
	
});

Topics.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Topics.after.remove(function(userId, doc) {
	
});
