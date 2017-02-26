this.PluginsPlDummyEditPlDummyController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlDummyEditPlDummy': { to: 'PluginsSubcontent'}
		
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
			pl_dummy: PlDummies.findOne({_id:this.params.plDummyId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});