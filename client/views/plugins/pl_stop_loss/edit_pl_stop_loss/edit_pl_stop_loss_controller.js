this.PluginsPlStopLossEditPlStopLossController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlStopLossEditPlStopLoss': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_stop_loss", this.params.plStopLossId)
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
			pl_stop_loss: PlStopLosses.findOne({_id:this.params.plStopLossId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});