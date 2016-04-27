Meteor.publish("dummys", function() {
	return Dummys.find({ownerId:this.userId}, {});
});

Meteor.publish("dummys_empty", function() {
	return Dummys.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("dummy", function(test1Id) {
	return Dummys.find({_id:test1Id,ownerId:this.userId}, {});
});

