this.PluginsPlProfitLineStopOutInsertPlProfitLineStopOutController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlProfitLineStopOutInsertPlProfitLineStopOut': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_profit_line_stop_out_outs_empty"),
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
			pl_profit_line_stop_out_outs_empty: PlProfitLineStopOuts.findOne({_id:null}, {}),
			settings: Settings.findOne({ownerId: Meteor.userId()})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});