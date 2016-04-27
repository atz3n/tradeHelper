this.PluginsController = RouteController.extend({
	template: "Plugins",
	

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
			swings: Swings.find({}, {}),
			dummys: Dummys.find({}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});