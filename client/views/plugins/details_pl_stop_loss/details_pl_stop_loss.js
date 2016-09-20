var pageSession = new ReactiveDict();

Template.PluginsDetailsPlStopLoss.rendered = function() {
	
};

Template.PluginsDetailsPlStopLoss.events({
	
});

Template.PluginsDetailsPlStopLoss.helpers({
	
});

Template.PluginsDetailsPlStopLossDetailsForm.rendered = function() {
	

	pageSession.set("pluginsDetailsPlStopLossDetailsFormInfoMessage", "");
	pageSession.set("pluginsDetailsPlStopLossDetailsFormErrorMessage", "");

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

Template.PluginsDetailsPlStopLossDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsDetailsPlStopLossDetailsFormInfoMessage", "");
		pageSession.set("pluginsDetailsPlStopLossDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsDetailsPlStopLossDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsDetailsPlStopLossDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsDetailsPlStopLossDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsDetailsPlStopLossDetailsFormErrorMessage", message);
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

Template.PluginsDetailsPlStopLossDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsDetailsPlStopLossDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsDetailsPlStopLossDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_stop_loss.exchange);
	}
	
});
