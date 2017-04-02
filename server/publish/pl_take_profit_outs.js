Meteor.publish("pl_take_profit_outs", function() {
	return PlTakeProfitOuts.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_take_profit_outs_empty", function() {
	return PlTakeProfitOuts.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_take_profit_out", function(plTakeProfitOutId) {
	return PlTakeProfitOuts.find({_id:plTakeProfitOutId,ownerId:this.userId}, {});
});

