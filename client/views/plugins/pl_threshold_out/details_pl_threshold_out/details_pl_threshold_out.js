var pageSession = new ReactiveDict();

Template.PluginsPlThresholdOutDetailsPlThresholdOut.rendered = function() {
	
};

Template.PluginsPlThresholdOutDetailsPlThresholdOut.events({
	
});

Template.PluginsPlThresholdOutDetailsPlThresholdOut.helpers({
	
});

Template.PluginsPlThresholdOutDetailsPlThresholdOutDetailsForm.rendered = function() {
	

	pageSession.set("PluginsPlThresholdOutDetailsPlThresholdOutDetailsFormInfoMessage", "");
	pageSession.set("PluginsPlThresholdOutDetailsPlThresholdOutDetailsFormErrorMessage", "");

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

Template.PluginsPlThresholdOutDetailsPlThresholdOutDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlThresholdOutDetailsPlThresholdOutDetailsFormInfoMessage", "");
		pageSession.set("PluginsPlThresholdOutDetailsPlThresholdOutDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlThresholdOutDetailsPlThresholdOutDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlThresholdOutDetailsPlThresholdOutDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlThresholdOutDetailsPlThresholdOutDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlThresholdOutDetailsPlThresholdOutDetailsFormErrorMessage", message);
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

		Router.go("plugins.pl_threshold_out", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins.pl_threshold_out", {});
	}

	
});

Template.PluginsPlThresholdOutDetailsPlThresholdOutDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlThresholdOutDetailsPlThresholdOutDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlThresholdOutDetailsPlThresholdOutDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_threshold_out.exchange);
	}
	
});
