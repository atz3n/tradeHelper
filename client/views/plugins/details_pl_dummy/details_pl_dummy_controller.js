this.PluginsDetailsPlDummyController = RouteController.extend({
	template: "PluginsDetailsPlDummy",
	

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
			Meteor.subscribe("pl_dummy", this.params.plDummyId)
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
			pl_dummy: PlDummys.findOne({_id:this.params.plDummyId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});