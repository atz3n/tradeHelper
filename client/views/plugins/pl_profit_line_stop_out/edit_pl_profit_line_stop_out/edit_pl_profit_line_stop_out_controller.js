this.PluginsPlProfitLineStopOutEditPlProfitLineStopOutController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlProfitLineStopOutEditPlProfitLineStopOut': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_profit_line_stop_out", this.params.plProfitLineStopOutId)
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
			pl_profit_line_stop_out: PlProfitLineStopOuts.findOne({_id:this.params.plProfitLineStopOutId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});