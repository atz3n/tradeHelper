Meteor.publish("pl_take_profits", function() {
	return PlTakeProfits.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_take_profits_empty", function() {
	return PlTakeProfits.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_take_profit", function(plTakeProfitId) {
	return PlTakeProfits.find({_id:plTakeProfitId,ownerId:this.userId}, {});
});

