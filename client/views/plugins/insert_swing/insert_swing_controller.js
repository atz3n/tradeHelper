this.PluginsInsertSwingController = RouteController.extend({
	template: "PluginsInsertSwing",
	

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
			Meteor.subscribe("test_datas"),
			Meteor.subscribe("swings_empty")
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
			testDatas: TestDatas.find({}, {}),
			swings_empty: Swings.findOne({_id:null}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});