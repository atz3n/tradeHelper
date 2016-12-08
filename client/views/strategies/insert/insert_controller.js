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
			strategies_empty: Strategies.findOne({_id:null}, {}),
			settings: Settings.findOne({ownerId: Meteor.userId()})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});