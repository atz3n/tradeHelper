Meteor.publish("pl_profit_line_stop_outs", function() {
	return PlProfitLineStopOuts.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_profit_line_stop_outs_empty", function() {
	return PlProfitLineStopOuts.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_profit_line_stop_out", function(plProfitLineStopOutId) {
	return PlProfitLineStopOuts.find({_id:plProfitLineStopOutId,ownerId:this.userId}, {});
});

