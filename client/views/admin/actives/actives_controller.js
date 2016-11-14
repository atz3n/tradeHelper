this.AdminActivesController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminActives': { to: 'AdminSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("Admin"); this.render("loading", { to: "AdminSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("admin_users"),
			Meteor.subscribe("active_datas_admin")
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
			admin_users: Users.find({}, {}),
			active_datas_admin: ActiveDatas.find({}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});