this.StrategiesEditController = RouteController.extend({
	template: "StrategiesEdit",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("strategy", this.params.strategyId),
			Meteor.subscribe("pluginbundles")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		var data = {
			params: this.params || {},
			strategy: Strategies.findOne({_id:this.params.strategyId}, {}),
			pluginbundles: Pluginbundles.find({},{})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});