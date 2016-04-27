var pageSession = new ReactiveDict();

Template.PluginsDetailsSwing.rendered = function() {
	
};

Template.PluginsDetailsSwing.events({
	
});

Template.PluginsDetailsSwing.helpers({
	
});

Template.PluginsDetailsSwingDetailsForm.rendered = function() {
	

	pageSession.set("pluginsDetailsSwingDetailsFormInfoMessage", "");
	pageSession.set("pluginsDetailsSwingDetailsFormErrorMessage", "");

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

Template.PluginsDetailsSwingDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsDetailsSwingDetailsFormInfoMessage", "");
		pageSession.set("pluginsDetailsSwingDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsDetailsSwingDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsDetailsSwingDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsDetailsSwingDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsDetailsSwingDetailsFormErrorMessage", message);
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

		Router.go("plugins", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins", {});
	}

	
});

Template.PluginsDetailsSwingDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsDetailsSwingDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsDetailsSwingDetailsFormErrorMessage");
	}
	
});
