Meteor.publish("topics", function() {
	return Topics.find({}, {});
});

Meteor.publish("topics_empty", function() {
	return Topics.find({_id:null}, {});
});

Meteor.publish("topic", function(topicId) {
	return Topics.find({_id:topicId}, {});
});

