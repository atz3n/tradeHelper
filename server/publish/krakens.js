Meteor.publish("krakens", function() {
	return Krakens.find({ownerId:this.userId}, {});
});

Meteor.publish("krakens_empty", function() {
	return Krakens.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("kraken", function(krakenId) {
	return Krakens.find({_id:krakenId,ownerId:this.userId}, {});
});

