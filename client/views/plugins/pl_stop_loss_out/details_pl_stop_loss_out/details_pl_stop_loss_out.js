var pageSession = new ReactiveDict();

Template.PluginsPlStopLossOutDetailsPlStopLossOut.rendered = function() {
	
};

Template.PluginsPlStopLossOutDetailsPlStopLossOut.events({
	
});

Template.PluginsPlStopLossOutDetailsPlStopLossOut.helpers({
	
});

Template.PluginsPlStopLossOutDetailsPlStopLossOutDetailsForm.rendered = function() {
	

	pageSession.set("PluginsPlStopLossOutDetailsPlStopLossOutDetailsFormInfoMessage", "");
	pageSession.set("PluginsPlStopLossOutDetailsPlStopLossOutDetailsFormErrorMessage", "");

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

Template.PluginsPlStopLossOutDetailsPlStopLossOutDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlStopLossOutDetailsPlStopLossOutDetailsFormInfoMessage", "");
		pageSession.set("PluginsPlStopLossOutDetailsPlStopLossOutDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlStopLossOutDetailsPlStopLossOutDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlStopLossOutDetailsPlStopLossOutDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlStopLossOutDetailsPlStopLossOutDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlStopLossOutDetailsPlStopLossOutDetailsFormErrorMessage", message);
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

		Router.go("plugins.pl_stop_loss_out", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins.pl_stop_loss_out", {});
	}

	
});

Template.PluginsPlStopLossOutDetailsPlStopLossOutDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlStopLossOutDetailsPlStopLossOutDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlStopLossOutDetailsPlStopLossOutDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_stop_loss_out.exchange);
	}
	
});
