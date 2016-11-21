this.HistoryStrHistoryController = RouteController.extend({
	template: "HistoryStrHistory",
	

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
			Meteor.subscribe("str_histories", this.params.activeId)
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
			str_histories: Histories.find({activeId:this.params.activeId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});