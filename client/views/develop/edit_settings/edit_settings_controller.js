this.DevelopEditSettingsController = RouteController.extend({
	template: "DevelopEditSettings",
	

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
			Meteor.subscribe("setting", this.params.settingId)
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
			setting: Settings.findOne({_id:this.params.settingId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});