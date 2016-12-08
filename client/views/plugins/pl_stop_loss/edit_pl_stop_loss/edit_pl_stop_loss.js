var pageSession = new ReactiveDict();

Template.PluginsPlStopLossEditPlStopLoss.rendered = function() {
	
};

Template.PluginsPlStopLossEditPlStopLoss.events({
	
});

Template.PluginsPlStopLossEditPlStopLoss.helpers({
	
});

Template.PluginsPlStopLossEditPlStopLossEditForm.rendered = function() {
	

	pageSession.set("PluginsPlStopLossEditPlStopLossEditFormInfoMessage", "");
	pageSession.set("PluginsPlStopLossEditPlStopLossEditFormErrorMessage", "");

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

Template.PluginsPlStopLossEditPlStopLossEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlStopLossEditPlStopLossEditFormInfoMessage", "");
		pageSession.set("PluginsPlStopLossEditPlStopLossEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlStopLossEditPlStopLossEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlStopLossEditPlStopLossEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlStopLossEditPlStopLossEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_stop_loss", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlStopLossEditPlStopLossEditFormErrorMessage", message);
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

		

		Router.go("plugins.pl_stop_loss", {});
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

Template.PluginsPlStopLossEditPlStopLossEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlStopLossEditPlStopLossEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlStopLossEditPlStopLossEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
