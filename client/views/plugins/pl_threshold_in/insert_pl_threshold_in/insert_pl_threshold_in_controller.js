this.PluginsPlThresholdInInsertPlThresholdInController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlThresholdInInsertPlThresholdIn': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_threshold_ins_empty"),
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
			pl_threshold_ins_empty: PlThresholdIns.findOne({_id:null}, {}),
			settings: Settings.findOne({ownerId: Meteor.userId()})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});