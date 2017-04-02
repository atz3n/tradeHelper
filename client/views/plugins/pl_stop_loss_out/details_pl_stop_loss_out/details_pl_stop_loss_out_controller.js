this.PluginsPlStopLossOutDetailsPlStopLossOutController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlStopLossOutDetailsPlStopLossOut': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_stop_loss_out", this.params.plStopLossOutId)
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
			pl_stop_loss_out: PlStopLossOutes.findOne({_id:this.params.plStopLossOutId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});