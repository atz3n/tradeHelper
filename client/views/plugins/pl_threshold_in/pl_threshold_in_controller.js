this.PluginsPlThresholdInController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlThresholdIn': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_threshold_ins")
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
			pl_threshold_ins: PlThresholdIns.find({}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});