var pageSession = new ReactiveDict();

Template.PluginsPlSafetyLineOutDetailsPlSafetyLineOut.rendered = function() {
	
};

Template.PluginsPlSafetyLineOutDetailsPlSafetyLineOut.events({
	
});

Template.PluginsPlSafetyLineOutDetailsPlSafetyLineOut.helpers({
	
});

Template.PluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsForm.rendered = function() {
	

	pageSession.set("pluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsFormInfoMessage", "");
	pageSession.set("pluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsFormErrorMessage", "");

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

Template.PluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsFormInfoMessage", "");
		pageSession.set("pluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsFormErrorMessage", message);
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

		Router.go("plugins.pl_safety_line_out", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins.pl_safety_line_out", {});
	}

	
});

Template.PluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsPlSafetyLineOutDetailsPlSafetyLineOutDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_safety_line_out.exchange);
	}
	
});
