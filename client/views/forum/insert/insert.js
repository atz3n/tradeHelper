var pageSession = new ReactiveDict();

Template.ForumInsert.rendered = function() {
	
};

Template.ForumInsert.events({
	
});

Template.ForumInsert.helpers({
	
});

Template.ForumInsertInsertForm.rendered = function() {
	

	pageSession.set("forumInsertInsertFormInfoMessage", "");
	pageSession.set("forumInsertInsertFormErrorMessage", "");

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

Template.ForumInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("forumInsertInsertFormInfoMessage", "");
		pageSession.set("forumInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var forumInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(forumInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("forumInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("forum", {topicId: newId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("forumInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Topics.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ForumInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("forumInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("forumInsertInsertFormErrorMessage");
	},
	"tt": function() {
		return ttTopic.insEdi;
	}
	
});
