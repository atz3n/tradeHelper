this.ExchangesDetailsTestDataController = RouteController.extend({
	template: "ExchangesDetailsTestData",
	

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
			Meteor.subscribe("test_data", this.params.testDataId)
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
			test_data: TestDatas.findOne({_id:this.params.testDataId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});