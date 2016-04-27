var pageSession = new ReactiveDict();

Template.DevelopDetailsSettings.rendered = function() {
	
};

Template.DevelopDetailsSettings.events({
	
});

Template.DevelopDetailsSettings.helpers({
	
});

Template.DevelopDetailsSettingsDetailsForm.rendered = function() {
	

	pageSession.set("developDetailsSettingsDetailsFormInfoMessage", "");
	pageSession.set("developDetailsSettingsDetailsFormErrorMessage", "");

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

Template.DevelopDetailsSettingsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("developDetailsSettingsDetailsFormInfoMessage", "");
		pageSession.set("developDetailsSettingsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var developDetailsSettingsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(developDetailsSettingsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("developDetailsSettingsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("developDetailsSettingsDetailsFormErrorMessage", message);
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

		Router.go("develop", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("develop", {});
	}

	
});

Template.DevelopDetailsSettingsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("developDetailsSettingsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("developDetailsSettingsDetailsFormErrorMessage");
	}
	
});
