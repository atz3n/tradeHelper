Meteor.publish("pl_dummys", function() {
	return PlDummys.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_dummys_empty", function() {
	return PlDummys.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_dummy", function(plDummyId) {
	return PlDummys.find({_id:plDummyId,ownerId:this.userId}, {});
});

