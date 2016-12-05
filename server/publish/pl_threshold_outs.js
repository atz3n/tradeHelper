Meteor.publish("pl_threshold_outs", function() {
	return PlThresholdOuts.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_threshold_outs_empty", function() {
	return PlThresholdOuts.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_threshold_out", function(plThresholdOutId) {
	return PlThresholdOuts.find({_id:plThresholdOutId,ownerId:this.userId}, {});
});

