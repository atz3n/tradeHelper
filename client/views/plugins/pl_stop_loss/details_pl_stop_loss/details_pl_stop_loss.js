var pageSession = new ReactiveDict();

Template.PluginsPlStopLossDetailsPlStopLoss.rendered = function() {
	
};

Template.PluginsPlStopLossDetailsPlStopLoss.events({
	
});

Template.PluginsPlStopLossDetailsPlStopLoss.helpers({
	
});

Template.PluginsPlStopLossDetailsPlStopLossDetailsForm.rendered = function() {
	

	pageSession.set("PluginsPlStopLossDetailsPlStopLossDetailsFormInfoMessage", "");
	pageSession.set("PluginsPlStopLossDetailsPlStopLossDetailsFormErrorMessage", "");

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

Template.PluginsPlStopLossDetailsPlStopLossDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlStopLossDetailsPlStopLossDetailsFormInfoMessage", "");
		pageSession.set("PluginsPlStopLossDetailsPlStopLossDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlStopLossDetailsPlStopLossDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlStopLossDetailsPlStopLossDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlStopLossDetailsPlStopLossDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlStopLossDetailsPlStopLossDetailsFormErrorMessage", message);
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

		Router.go("plugins.pl_stop_loss", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins.pl_stop_loss", {});
	}

	
});

Template.PluginsPlStopLossDetailsPlStopLossDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlStopLossDetailsPlStopLossDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlStopLossDetailsPlStopLossDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_stop_loss.exchange);
	}
	
});
