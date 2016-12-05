this.ExchangesTestDataController = RouteController.extend({
	template: "Exchanges",
	

	yieldTemplates: {
		'ExchangesTestData': { to: 'ExchangesSubcontent'}
		
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
			Meteor.subscribe("ex_test_datas")
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
			ex_test_datas: ExTestDatas.find({}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});