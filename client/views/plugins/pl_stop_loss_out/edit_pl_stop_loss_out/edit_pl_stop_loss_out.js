var pageSession = new ReactiveDict();

Template.PluginsPlStopLossOutEditPlStopLossOut.rendered = function() {
	
};

Template.PluginsPlStopLossOutEditPlStopLossOut.events({
	
});

Template.PluginsPlStopLossOutEditPlStopLossOut.helpers({
	
});

Template.PluginsPlStopLossOutEditPlStopLossOutEditForm.rendered = function() {
	

	pageSession.set("PluginsPlStopLossOutEditPlStopLossOutEditFormInfoMessage", "");
	pageSession.set("PluginsPlStopLossOutEditPlStopLossOutEditFormErrorMessage", "");

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

Template.PluginsPlStopLossOutEditPlStopLossOutEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlStopLossOutEditPlStopLossOutEditFormInfoMessage", "");
		pageSession.set("PluginsPlStopLossOutEditPlStopLossOutEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlStopLossOutEditPlStopLossOutEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlStopLossOutEditPlStopLossOutEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlStopLossOutEditPlStopLossOutEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_stop_loss_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlStopLossOutEditPlStopLossOutEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlStopLossOutes.update({ _id: t.data.pl_stop_loss_out._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("plugins.pl_stop_loss_out", {});
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

Template.PluginsPlStopLossOutEditPlStopLossOutEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlStopLossOutEditPlStopLossOutEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlStopLossOutEditPlStopLossOutEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
