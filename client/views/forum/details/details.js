var pageSession = new ReactiveDict();

Template.ForumDetails.rendered = function() {
	
};

Template.ForumDetails.events({
	
});

Template.ForumDetails.helpers({
	
});

Template.ForumDetailsDetailsForm.rendered = function() {
	pageSession.set("forumDetailsDetailsFormInfoMessage", "");
	pageSession.set("forumDetailsDetailsFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.ForumDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("forumDetailsDetailsFormInfoMessage", "");
		pageSession.set("forumDetailsDetailsFormErrorMessage", "");

		var self = this;

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("forumDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				
				var cmmntObj = {};
				cmmntObj.date = new Date();
				cmmntObj.autor = self.current_user_data.profile.name;
				cmmntObj.role = self.current_user_data.roles[0];
				cmmntObj.comment = values.comment;


				var tmp = self.topicComments.comments;
				tmp.push(cmmntObj);

				
				var id = Comments.findOne({ topicId: t.data.topic._id })['_id'];
				Comments.update({ _id: id }, { $set: { comments: tmp } }, function(e) { if(e) errorAction(e);});


				var el = document.getElementById("comment")
				el.value = '';
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("forum", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("forum", {});
	},
	"click #delete-button": function(e, t) {
	  e.preventDefault();

	  var self = this;
	  var tmp = t.data.topicComments.comments;
	  
	  var idx = tmp.findIndex(function(element, index, array){
	  	if(element.date == self.date) return true;
	  });

	  tmp[idx].comment = '__*erased by admin*__';

	  var id = Comments.findOne({ topicId: t.data.topic._id })['_id'];
	  Comments.update({ _id: id }, { $set: { comments: tmp } });
	},
});

Template.ForumDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("forumDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("forumDetailsDetailsFormErrorMessage");
	},
	"tt": function() {
		return ttTopic.desc;
	},
	"isAdmin": function() {
		return getUserRole(Meteor.userId()) === 'admin';
	}
	
});
