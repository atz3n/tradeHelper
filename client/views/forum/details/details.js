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

		function submitAction(msg) {
			var forumDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(forumDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("forumDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

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
	}

	
});

Template.ForumDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("forumDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("forumDetailsDetailsFormErrorMessage");
	}
	
});
