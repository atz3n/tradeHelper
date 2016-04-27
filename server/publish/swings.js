Meteor.publish("swings", function() {
	return Swings.find({ownerId:this.userId}, {});
});

Meteor.publish("swings_empty", function() {
	return Swings.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("swing", function(swingId) {
	return Swings.find({_id:swingId,ownerId:this.userId}, {});
});

