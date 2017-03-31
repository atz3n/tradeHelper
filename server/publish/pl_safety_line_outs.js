Meteor.publish("pl_safety_line_outs", function() {
	return PlSafetyLineOuts.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_safety_line_outs_empty", function() {
	return PlSafetyLineOuts.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_safety_line_out", function(plSafetyLineOutId) {
	return PlSafetyLineOuts.find({_id:plSafetyLineOutId,ownerId:this.userId}, {});
});

