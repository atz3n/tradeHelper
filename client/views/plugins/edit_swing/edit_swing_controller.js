this.PluginsEditSwingController = RouteController.extend({
	template: "PluginsEditSwing",
	

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
			Meteor.subscribe("swing", this.params.swingId)
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
			swing: Swings.findOne({_id:this.params.swingId}, {}),
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});