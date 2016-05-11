this.ActivesDetailsController = RouteController.extend({
	template: "ActivesDetails",
	

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
			Meteor.subscribe("strategy", this.params.strategyId)
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
			strategy: Strategies.findOne({_id:this.params.strategyId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});