this.PluginbundlesEditController = RouteController.extend({
	template: "PluginbundlesEdit",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("pluginbundle", this.params.pluginbundleId),
			Meteor.subscribe("pl_swings"),
			Meteor.subscribe("pl_dummys")
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
			pluginbundle: PluginBundles.findOne({_id:this.params.pluginbundleId}, {}),
			pl_swings: PlSwings.find({},{}),
			pl_dummys: PlDummys.find({},{})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});