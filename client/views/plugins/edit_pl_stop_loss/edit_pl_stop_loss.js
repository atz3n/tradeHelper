var pageSession = new ReactiveDict();

Template.PluginsEditPlStopLoss.rendered = function() {
	
};

Template.PluginsEditPlStopLoss.events({
	
});

Template.PluginsEditPlStopLoss.helpers({
	
});

Template.PluginsEditPlStopLossEditForm.rendered = function() {
	

	pageSession.set("pluginsEditPlStopLossEditFormInfoMessage", "");
	pageSession.set("pluginsEditPlStopLossEditFormErrorMessage", "");

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

Template.PluginsEditPlStopLossEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsEditPlStopLossEditFormInfoMessage", "");
		pageSession.set("pluginsEditPlStopLossEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsEditPlStopLossEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsEditPlStopLossEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsEditPlStopLossEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsEditPlStopLossEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlStopLosses.update({ _id: t.data.pl_stop_loss._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("plugins", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.PluginsEditPlStopLossEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsEditPlStopLossEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsEditPlStopLossEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
