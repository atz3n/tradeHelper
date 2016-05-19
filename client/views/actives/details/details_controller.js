this.ActivesDetailsController = RouteController.extend({
	template: "ActivesDetails",
	

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
			Meteor.subscribe("strategies_active"),
			Meteor.subscribe("active_datas")
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
			strategies_active: Strategies.find({active: true}, {}).fetch(),
			active_data: ActiveDatas.findOne({strategyId: Strategies.findOne({_id:this.params.strategyId}, {})._id},{})
		};

		return data;
	},

	onAfterAction: function() {
		
	}
});