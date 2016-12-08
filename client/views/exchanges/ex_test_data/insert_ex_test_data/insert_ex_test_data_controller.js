this.ExchangesExTestDataInsertExTestDataController = RouteController.extend({
	template: "Exchanges",
	

	yieldTemplates: {
		'ExchangesExTestDataInsertExTestData': { to: 'ExchangesSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("Exchanges"); this.render("loading", { to: "ExchangesSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("ex_test_datas_empty"),
			Meteor.subscribe("exTestData_tradePairs"),
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
			ex_test_datas_empty: ExTestDatas.findOne({_id:null}, {}),
			exTestData_tradePairs: TradePairs.findOne({type: 'ExTestData'}, {}),
			settings: Settings.findOne({ownerId: Meteor.userId()})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});