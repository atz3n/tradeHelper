Meteor.publish("pl_dummys", function() {
	return PlDummys.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_dummys_empty", function() {
	return PlDummys.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_dummy", function(test1Id) {
	return PlDummys.find({_id:test1Id,ownerId:this.userId}, {});
});

