this.ExchangesKrakenComController = RouteController.extend({
	template: "Exchanges",
	

	yieldTemplates: {
		'ExchangesKrakenCom': { to: 'ExchangesSubcontent'}
		
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
			Meteor.subscribe("ex_krakens")
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
			ex_krakens: ExKrakens.find({}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});