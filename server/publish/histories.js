Meteor.publish("histories", function() {
	return Histories.find({ownerId:this.userId}, {});
});

Meteor.publish("history", function(historyId) {
	return Histories.find({_id:historyId,ownerId:this.userId}, {});
});

Meteor.publish("str_histories", function(activeId) {
	return Histories.find({activeId:activeId,ownerId:this.userId}, {});
});

