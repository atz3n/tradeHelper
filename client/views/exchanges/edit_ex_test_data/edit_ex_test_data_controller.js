this.ExchangesEditExTestDataController = RouteController.extend({
	template: "ExchangesEditExTestData",
	

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
			Meteor.subscribe("ex_test_data", this.params.exTestDataId)
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
			ex_test_data: ExTestDatas.findOne({_id:this.params.exTestDataId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});