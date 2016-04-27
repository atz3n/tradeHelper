this.ExchangesController = RouteController.extend({
	template: "Exchanges",
	

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
			Meteor.subscribe("krakens"),
			Meteor.subscribe("test_datas")
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
			krakens: Krakens.find({}, {}),
			test_datas: TestDatas.find({}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});