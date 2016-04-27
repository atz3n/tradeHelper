Krakens.allow({
	insert: function (userId, doc) {
		return Krakens.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Krakens.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Krakens.userCanRemove(userId, doc);
	}
});

Krakens.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Krakens.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Krakens.before.remove(function(userId, doc) {
	
});

Krakens.after.insert(function(userId, doc) {
	
});

Krakens.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Krakens.after.remove(function(userId, doc) {
	
});
