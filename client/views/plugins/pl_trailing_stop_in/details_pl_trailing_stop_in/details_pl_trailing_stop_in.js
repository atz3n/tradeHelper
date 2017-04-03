var pageSession = new ReactiveDict();

Template.PluginsPlTrailingStopInDetailsPlTrailingStopIn.rendered = function() {
	
};

Template.PluginsPlTrailingStopInDetailsPlTrailingStopIn.events({
	
});

Template.PluginsPlTrailingStopInDetailsPlTrailingStopIn.helpers({
	
});

Template.PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsForm.rendered = function() {
	

	pageSession.set("PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsFormInfoMessage", "");
	pageSession.set("PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsFormErrorMessage", "");

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

Template.PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsFormInfoMessage", "");
		pageSession.set("PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsFormErrorMessage", message);
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

		Router.go("plugins.pl_trailing_stop_in", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins.pl_trailing_stop_in", {});
	}

	
});

Template.PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTrailingStopInDetailsPlTrailingStopInDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_trailing_stop_in.exchange);
	}
	
});
