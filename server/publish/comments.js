Meteor.publish("topicComments", function(topicId) {
	return Comments.find({topicId:topicId}, {});
});