var pageSession = new ReactiveDict();

Template.PluginsDetailsPlTakeProfit.rendered = function() {
	
};

Template.PluginsDetailsPlTakeProfit.events({
	
});

Template.PluginsDetailsPlTakeProfit.helpers({
	
});

Template.PluginsDetailsPlTakeProfitDetailsForm.rendered = function() {
	

	pageSession.set("pluginsDetailsPlTakeProfitDetailsFormInfoMessage", "");
	pageSession.set("pluginsDetailsPlTakeProfitDetailsFormErrorMessage", "");

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

Template.PluginsDetailsPlTakeProfitDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsDetailsPlTakeProfitDetailsFormInfoMessage", "");
		pageSession.set("pluginsDetailsPlTakeProfitDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsDetailsPlTakeProfitDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsDetailsPlTakeProfitDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsDetailsPlTakeProfitDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsDetailsPlTakeProfitDetailsFormErrorMessage", message);
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

Template.PluginsDetailsPlTakeProfitDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsDetailsPlTakeProfitDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsDetailsPlTakeProfitDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_take_profit.exchange);
	}
	
});
