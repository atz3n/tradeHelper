this.PluginsEditPlTakeProfitController = RouteController.extend({
	template: "PluginsEditPlTakeProfit",
	

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
			Meteor.subscribe("pl_take_profit", this.params.plTakeProfitId)
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
			pl_take_profit: PlTakeProfits.findOne({_id:this.params.plTakeProfitId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});