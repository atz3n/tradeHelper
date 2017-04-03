this.PluginsPlTrailingStopOutController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlTrailingStopOut': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_trailing_stop_outs")
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
			pl_trailing_stop_outs: PlTrailingStopOuts.find({}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});