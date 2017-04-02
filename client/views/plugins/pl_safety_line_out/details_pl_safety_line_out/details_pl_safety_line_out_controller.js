this.PluginsPlSafetyLineOutDetailsPlSafetyLineOutController = RouteController.extend({
	template: "Plugins",
	

	yieldTemplates: {
		'PluginsPlSafetyLineOutDetailsPlSafetyLineOut': { to: 'PluginsSubcontent'}
		
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
			Meteor.subscribe("pl_safety_line_out", this.params.plSafetyLineOutId)
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
			pl_safety_line_out: PlSafetyLineOuts.findOne({_id:this.params.plSafetyLineOutId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});