Meteor.publish("exKraken_tradePairs", function() {
	return TradePairs.find({type:'ExKraken'}, {});
});

Meteor.publish("exTestData_tradePairs", function() {
	return TradePairs.find({type: 'ExTestData'}, {});
});