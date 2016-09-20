var pageSession = new ReactiveDict();

Template.PluginsInsertPlStopLoss.rendered = function() {
	
};

Template.PluginsInsertPlStopLoss.events({
	
});

Template.PluginsInsertPlStopLoss.helpers({
	
});

Template.PluginsInsertPlStopLossInsertForm.rendered = function() {
	

	pageSession.set("pluginsInsertPlStopLossInsertFormInfoMessage", "");
	pageSession.set("pluginsInsertPlStopLossInsertFormErrorMessage", "");

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

Template.PluginsInsertPlStopLossInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsInsertPlStopLossInsertFormInfoMessage", "");
		pageSession.set("pluginsInsertPlStopLossInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsInsertPlStopLossInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsInsertPlStopLossInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsInsertPlStopLossInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsInsertPlStopLossInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlStopLosses.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsInsertPlStopLossInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsInsertPlStopLossInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsInsertPlStopLossInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
