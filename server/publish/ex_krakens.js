Meteor.publish("ex_krakens", function() {
	return ExKrakens.find({ownerId:this.userId}, {});
});

Meteor.publish("ex_krakens_empty", function() {
	return ExKrakens.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("ex_kraken", function(exKrakenId) {
	return ExKrakens.find({_id:exKrakenId,ownerId:this.userId}, {});
});

