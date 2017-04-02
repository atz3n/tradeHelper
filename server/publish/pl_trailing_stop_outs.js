Meteor.publish("pl_trailing_stop_outs", function() {
	return PlTrailingStopOuts.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_trailing_stop_outs_empty", function() {
	return PlTrailingStopOuts.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_trailing_stop_out", function(plTrailingStopOutId) {
	return PlTrailingStopOuts.find({_id:plTrailingStopOutId,ownerId:this.userId}, {});
});

