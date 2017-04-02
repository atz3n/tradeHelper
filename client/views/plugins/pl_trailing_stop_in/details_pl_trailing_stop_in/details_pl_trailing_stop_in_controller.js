this.PluginsPlTrailingStopInDetailsPlTrailingStopInController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlTrailingStopInDetailsPlTrailingStopIn': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_trailing_stop_in", this.params.plTrailingStopInId)
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
			pl_trailing_stop_in: PlTrailingStopIns.findOne({_id:this.params.plTrailingStopInId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});