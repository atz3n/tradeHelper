Meteor.publish("pl_dummies", function() {
	return PlDummies.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_dummies_empty", function() {
	return PlDummies.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_dummy", function(plDummyId) {
	return PlDummies.find({_id:plDummyId,ownerId:this.userId}, {});
});

