this.ExchangesInsertExTestDataController = RouteController.extend({
	template: "ExchangesInsertExTestData",
	

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
			Meteor.subscribe("ex_test_datas_empty"),
			Meteor.subscribe("exTestData_tradePairs")
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
			ex_test_datas_empty: ExTestDatas.findOne({_id:null}, {}),
			exTestData_tradePairs: TradePairs.findOne({type: 'ExTestData'}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});