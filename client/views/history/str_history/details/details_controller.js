this.HistoryStrHistoryDetailsController = RouteController.extend({
	template: "HistoryStrHistoryDetails",
	

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
			Meteor.subscribe("history", this.params.historyId)
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
			history: Histories.findOne({_id:this.params.historyId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});