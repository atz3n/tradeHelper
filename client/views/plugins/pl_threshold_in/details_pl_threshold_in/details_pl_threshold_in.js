var pageSession = new ReactiveDict();

Template.PluginsPlThresholdInDetailsPlThresholdIn.rendered = function() {
	
};

Template.PluginsPlThresholdInDetailsPlThresholdIn.events({
	
});

Template.PluginsPlThresholdInDetailsPlThresholdIn.helpers({
	
});

Template.PluginsPlThresholdInDetailsPlThresholdInDetailsForm.rendered = function() {
	

	pageSession.set("PluginsPlThresholdInDetailsPlThresholdInDetailsFormInfoMessage", "");
	pageSession.set("PluginsPlThresholdInDetailsPlThresholdInDetailsFormErrorMessage", "");

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

Template.PluginsPlThresholdInDetailsPlThresholdInDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlThresholdInDetailsPlThresholdInDetailsFormInfoMessage", "");
		pageSession.set("PluginsPlThresholdInDetailsPlThresholdInDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlThresholdInDetailsPlThresholdInDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlThresholdInDetailsPlThresholdInDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlThresholdInDetailsPlThresholdInDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlThresholdInDetailsPlThresholdInDetailsFormErrorMessage", message);
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

		Router.go("plugins.pl_threshold_in", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins.pl_threshold_in", {});
	}

	
});

Template.PluginsPlThresholdInDetailsPlThresholdInDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlThresholdInDetailsPlThresholdInDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlThresholdInDetailsPlThresholdInDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_threshold_in.exchange);
	}
	
});
