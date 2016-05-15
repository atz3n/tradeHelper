this.PluginsEditPlSwingController = RouteController.extend({
	template: "PluginsEditPlSwing",
	

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
			Meteor.subscribe("pl_swing", this.params.plSwingId)
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
			pl_swing: PlSwings.findOne({_id:this.params.plSwingId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});