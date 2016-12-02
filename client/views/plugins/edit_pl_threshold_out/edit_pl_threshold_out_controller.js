this.PluginsEditPlThresholdOutController = RouteController.extend({
	template: "PluginsEditPlThresholdOut",
	

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
			Meteor.subscribe("pl_threshold_out", this.params.plThresholdOutId)
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
			pl_threshold_out: PlThresholdOuts.findOne({_id:this.params.plThresholdOutId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});