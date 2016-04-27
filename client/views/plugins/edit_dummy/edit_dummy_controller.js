this.PluginsEditDummyController = RouteController.extend({
	template: "PluginsEditDummy",
	

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
			Meteor.subscribe("dummy", this.params.test1Id)
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
			dummy: Dummys.findOne({_id:this.params.test1Id}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});