Meteor.publish("pl_threshold_ins", function() {
	return PlThresholdIns.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_threshold_ins_empty", function() {
	return PlThresholdIns.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_threshold_in", function(plThresholdInId) {
	return PlThresholdIns.find({_id:plThresholdInId,ownerId:this.userId}, {});
});

