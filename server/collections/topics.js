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


	/* adding topic number */
	var tpCnt = ServerDatas.findOne().topicCounter;
	var tmp = '';

	if(tpCnt < 10) tmp += '000';
	if(tpCnt < 100 && tpCnt >= 10) tmp += '00';
	if(tpCnt < 1000 && tpCnt >= 100) tmp += '0';
	doc.topicNum = tmp + tpCnt;
	
	tpCnt++;
	ServerDatas.update({_id: serverDataId}, { $set: { topicCounter: tpCnt } })

	/* adding state */
	doc.state = 'created';

	/* adding autor */
	doc.autor = getUserName(userId);

	/* adding number of comments */
	doc.numOfCmnt = 0;

	if(!doc.ownerId) doc.ownerId = userId;
});

Topics.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Topics.before.remove(function(userId, doc) {
	/* remove corresponding comment doc */
	Comments.remove({topicId: doc._id});
});

Topics.after.insert(function(userId, doc) {
	/* creating comments doc */
	Comments.insert({topicId: doc._id});
});

Topics.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Topics.after.remove(function(userId, doc) {
	
});
