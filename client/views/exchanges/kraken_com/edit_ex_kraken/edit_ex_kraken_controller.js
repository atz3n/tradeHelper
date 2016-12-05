this.ExchangesKrakenComEditExKrakenController = RouteController.extend({
	template: "Exchanges",
	

	yieldTemplates: {
		'ExchangesKrakenComEditExKraken': { to: 'ExchangesSubcontent'}
		
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
			Meteor.subscribe("ex_kraken", this.params.exKrakenId),
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
			ex_kraken: ExKrakens.findOne({_id:this.params.exKrakenId}, {}),
			exKraken_tradePairs: TradePairs.findOne({type: 'ExKraken'}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});