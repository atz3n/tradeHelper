Meteor.publish("strategies", function() {
	return Strategies.find({ownerId:this.userId}, {});
});

Meteor.publish("strategies_active", function() {
	return Strategies.find({active:true,ownerId:this.userId}, {});
});

Meteor.publish("strategies_empty", function() {
	return Strategies.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("strategy", function(strategyId) {
	return Strategies.find({_id:strategyId,ownerId:this.userId}, {});
});

