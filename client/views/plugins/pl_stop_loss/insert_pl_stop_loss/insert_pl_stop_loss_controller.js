this.PluginsPlStopLossInsertPlStopLossController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlStopLossInsertPlStopLoss': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_stop_losses_empty"),
			Meteor.subscribe("settings_first")
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
			pl_stop_losses_empty: PlStopLosses.findOne({_id:null}, {}),
			settings: Settings.findOne({ownerId: Meteor.userId()})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});