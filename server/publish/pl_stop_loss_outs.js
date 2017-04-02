Meteor.publish("pl_stop_loss_outes", function() {
	return PlStopLossOutes.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_stop_loss_outes_empty", function() {
	return PlStopLossOutes.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_stop_loss_out", function(plStopLossOutId) {
	return PlStopLossOutes.find({_id:plStopLossOutId,ownerId:this.userId}, {});
});

