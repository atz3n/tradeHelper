this.PluginbundlesInsertController = RouteController.extend({
	template: "PluginbundlesInsert",
	

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
			Meteor.subscribe("pluginbundles_empty"),
			Meteor.subscribe("swings"),
			Meteor.subscribe("dummys")
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
			pluginbundles_empty: Pluginbundles.findOne({_id:null}, {}),
			swings: Swings.find({},{}),
			dummys: Dummys.find({},{})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});