Meteor.publish("pl_stop_losses", function() {
	return PlStopLosses.find({ownerId:this.userId}, {});
});

Meteor.publish("pl_stop_losses_empty", function() {
	return PlStopLosses.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("pl_stop_loss", function(plStopLossId) {
	return PlStopLosses.find({_id:plStopLossId,ownerId:this.userId}, {});
});

