var pageSession = new ReactiveDict();

Template.PluginsDetailsPlThresholdOut.rendered = function() {
	
};

Template.PluginsDetailsPlThresholdOut.events({
	
});

Template.PluginsDetailsPlThresholdOut.helpers({
	
});

Template.PluginsDetailsPlThresholdOutDetailsForm.rendered = function() {
	

	pageSession.set("pluginsDetailsPlThresholdOutDetailsFormInfoMessage", "");
	pageSession.set("pluginsDetailsPlThresholdOutDetailsFormErrorMessage", "");

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

Template.PluginsDetailsPlThresholdOutDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsDetailsPlThresholdOutDetailsFormInfoMessage", "");
		pageSession.set("pluginsDetailsPlThresholdOutDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsDetailsPlThresholdOutDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsDetailsPlThresholdOutDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsDetailsPlThresholdOutDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsDetailsPlThresholdOutDetailsFormErrorMessage", message);
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

Template.PluginsDetailsPlThresholdOutDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsDetailsPlThresholdOutDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsDetailsPlThresholdOutDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_threshold_out.exchange);
	}
	
});
