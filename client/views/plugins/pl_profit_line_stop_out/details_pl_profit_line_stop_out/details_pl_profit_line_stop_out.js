var pageSession = new ReactiveDict();

Template.PluginsPlProfitLineStopOutDetailsPlProfitLineStopOut.rendered = function() {
	
};

Template.PluginsPlProfitLineStopOutDetailsPlProfitLineStopOut.events({
	
});

Template.PluginsPlProfitLineStopOutDetailsPlProfitLineStopOut.helpers({
	
});

Template.PluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsForm.rendered = function() {
	

	pageSession.set("pluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsFormInfoMessage", "");
	pageSession.set("pluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsFormErrorMessage", "");

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

Template.PluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsFormInfoMessage", "");
		pageSession.set("pluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsFormErrorMessage", message);
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

		Router.go("plugins.pl_profit_line_stop_out", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins.pl_profit_line_stop_out", {});
	}

	
});

Template.PluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsPlProfitLineStopOutDetailsPlProfitLineStopOutDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_profit_line_stop_out.exchange);
	}
	
});
