this.PluginsController = RouteController.extend({
	template: "Plugins",
	

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
			Meteor.subscribe("pl_swings"),
			Meteor.subscribe("pl_stop_losses"),
			Meteor.subscribe("pl_take_profits")
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
			pl_swings: PlSwings.find({}, {}),
			pl_stop_losses: PlStopLosses.find({}, {}),
			pl_take_profits: PlTakeProfits.find({}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});