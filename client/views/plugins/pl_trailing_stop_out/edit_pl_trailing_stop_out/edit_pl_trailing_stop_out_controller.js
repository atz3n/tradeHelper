this.PluginsPlTrailingStopOutEditPlTrailingStopOutController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlTrailingStopOutEditPlTrailingStopOut': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_trailing_stop_out", this.params.plTrailingStopOutId)
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
			pl_trailing_stop_out: PlTrailingStopOuts.findOne({_id:this.params.plTrailingStopOutId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});