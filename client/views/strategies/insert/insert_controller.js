this.StrategiesInsertController = RouteController.extend({
	template: "StrategiesInsert",
	

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
			Meteor.subscribe("strategies_empty"),
			Meteor.subscribe("pluginbundles")
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
			pluginbundles: Pluginbundles.find({},{})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});