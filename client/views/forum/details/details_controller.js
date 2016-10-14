this.ForumDetailsController = RouteController.extend({
	template: "ForumDetails",
	

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
			Meteor.subscribe("topic", this.params.topicId),
			Meteor.subscribe("topicComments", this.params.topicId),
			Meteor.subscribe("current_user_data")
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
			topic: Topics.findOne({_id:this.params.topicId}, {}),
			topicComments: Comments.findOne({topicId: this.params.topicId}, {}),
			current_user_data: Users.findOne({_id:Meteor.userId()}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});