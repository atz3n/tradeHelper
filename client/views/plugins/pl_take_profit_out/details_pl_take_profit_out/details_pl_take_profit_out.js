var pageSession = new ReactiveDict();

Template.PluginsPlTakeProfitOutDetailsPlTakeProfitOut.rendered = function() {
	
};

Template.PluginsPlTakeProfitOutDetailsPlTakeProfitOut.events({
	
});

Template.PluginsPlTakeProfitOutDetailsPlTakeProfitOut.helpers({
	
});

Template.PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsForm.rendered = function() {
	

	pageSession.set("PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsFormInfoMessage", "");
	pageSession.set("PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsFormErrorMessage", "");

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

Template.PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsFormInfoMessage", "");
		pageSession.set("PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsFormErrorMessage", message);
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

		Router.go("plugins.pl_take_profit_out", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins.pl_take_profit_out", {});
	}

	
});

Template.PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTakeProfitOutDetailsPlTakeProfitOutDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_take_profit_out.exchange);
	}
	
});
