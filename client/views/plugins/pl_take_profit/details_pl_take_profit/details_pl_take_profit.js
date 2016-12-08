var pageSession = new ReactiveDict();

Template.PluginsPlTakeProfitDetailsPlTakeProfit.rendered = function() {
	
};

Template.PluginsPlTakeProfitDetailsPlTakeProfit.events({
	
});

Template.PluginsPlTakeProfitDetailsPlTakeProfit.helpers({
	
});

Template.PluginsPlTakeProfitDetailsPlTakeProfitDetailsForm.rendered = function() {
	

	pageSession.set("PluginsPlTakeProfitDetailsPlTakeProfitDetailsFormInfoMessage", "");
	pageSession.set("PluginsPlTakeProfitDetailsPlTakeProfitDetailsFormErrorMessage", "");

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

Template.PluginsPlTakeProfitDetailsPlTakeProfitDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTakeProfitDetailsPlTakeProfitDetailsFormInfoMessage", "");
		pageSession.set("PluginsPlTakeProfitDetailsPlTakeProfitDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTakeProfitDetailsPlTakeProfitDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTakeProfitDetailsPlTakeProfitDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTakeProfitDetailsPlTakeProfitDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTakeProfitDetailsPlTakeProfitDetailsFormErrorMessage", message);
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

		Router.go("plugins.pl_take_profit", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins.pl_take_profit", {});
	}

	
});

Template.PluginsPlTakeProfitDetailsPlTakeProfitDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTakeProfitDetailsPlTakeProfitDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTakeProfitDetailsPlTakeProfitDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_take_profit.exchange);
	}
	
});
