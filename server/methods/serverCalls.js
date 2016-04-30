Meteor.methods({

    startStrategy: function(strategyId) {

    	var strategy = Strategies.find({_id: strategyId}).fetch();
    	console.log(strategy)
    }
});
