this.PluginsPlThresholdInDetailsPlThresholdInController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlThresholdInDetailsPlThresholdIn': { to: 'PluginsSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("Plugins"); this.render("loading", { to: "PluginsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("pl_threshold_in", this.params.plThresholdInId)
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
			pl_threshold_in: PlThresholdIns.findOne({_id:this.params.plThresholdInId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});