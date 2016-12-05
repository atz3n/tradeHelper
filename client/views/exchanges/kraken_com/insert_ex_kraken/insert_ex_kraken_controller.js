this.ExchangesKrakenComInsertExKrakenController = RouteController.extend({
	template: "Exchanges",
	

	yieldTemplates: {
		'ExchangesKrakenComInsertExKraken': { to: 'ExchangesSubcontent'}
		
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
			Meteor.subscribe("ex_krakens_empty"),
			Meteor.subscribe("exKraken_tradePairs")
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
			ex_krakens_empty: ExKrakens.findOne({_id:null}, {}),
			exKraken_tradePairs: TradePairs.findOne({type: 'ExKraken'}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});