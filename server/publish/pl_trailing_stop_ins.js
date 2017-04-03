Meteor.publish("pl_trailing_stop_ins", function() {
	return PlTrailingStopIns.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_trailing_stop_ins_empty", function() {
	return PlTrailingStopIns.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_trailing_stop_in", function(plTrailingStopInId) {
	return PlTrailingStopIns.find({_id:plTrailingStopInId,ownerId:this.userId}, {});
});

