Meteor.publish("pl_swings", function() {
	return PlSwings.publishJoinedCursors(PlSwings.find({ownerId:this.userId}, {}));
});

Meteor.publish("pl_swings_empty", function() {
	return PlSwings.publishJoinedCursors(PlSwings.find({_id:null,ownerId:this.userId}, {}));
});

Meteor.publish("pl_swing", function(plSwingId) {
	return PlSwings.publishJoinedCursors(PlSwings.find({_id:plSwingId,ownerId:this.userId}, {}));
});

