var pageSession = new ReactiveDict();

Template.PluginsDetailsPlThresholdIn.rendered = function() {
	
};

Template.PluginsDetailsPlThresholdIn.events({
	
});

Template.PluginsDetailsPlThresholdIn.helpers({
	
});

Template.PluginsDetailsPlThresholdInDetailsForm.rendered = function() {
	

	pageSession.set("pluginsDetailsPlThresholdInDetailsFormInfoMessage", "");
	pageSession.set("pluginsDetailsPlThresholdInDetailsFormErrorMessage", "");

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

Template.PluginsDetailsPlThresholdInDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsDetailsPlThresholdInDetailsFormInfoMessage", "");
		pageSession.set("pluginsDetailsPlThresholdInDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsDetailsPlThresholdInDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsDetailsPlThresholdInDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsDetailsPlThresholdInDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsDetailsPlThresholdInDetailsFormErrorMessage", message);
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

Template.PluginsDetailsPlThresholdInDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsDetailsPlThresholdInDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsDetailsPlThresholdInDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_threshold_in.exchange);
	}
	
});
