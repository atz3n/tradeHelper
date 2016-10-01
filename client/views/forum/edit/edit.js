var pageSession = new ReactiveDict();

Template.ForumEdit.rendered = function() {
	
};

Template.ForumEdit.events({
	
});

Template.ForumEdit.helpers({
	
});

Template.ForumEditEditForm.rendered = function() {
	

	pageSession.set("forumEditEditFormInfoMessage", "");
	pageSession.set("forumEditEditFormErrorMessage", "");

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

Template.ForumEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("forumEditEditFormInfoMessage", "");
		pageSession.set("forumEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var forumEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(forumEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("forumEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("forum", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("forumEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Topics.update({ _id: t.data.topic._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("forum", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.ForumEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("forumEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("forumEditEditFormErrorMessage");
	},
	"isDeveloper": function() {
		return getUserRole(Meteor.userId()) == 'developer';
	}
	
});
