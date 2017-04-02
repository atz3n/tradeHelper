var pageSession = new ReactiveDict();

Template.PluginsPlStopLossOutInsertPlStopLossOut.rendered = function() {
	
};

Template.PluginsPlStopLossOutInsertPlStopLossOut.events({
	
});

Template.PluginsPlStopLossOutInsertPlStopLossOut.helpers({
	
});

Template.PluginsPlStopLossOutInsertPlStopLossOutInsertForm.rendered = function() {
	

	pageSession.set("PluginsPlStopLossOutInsertPlStopLossOutInsertFormInfoMessage", "");
	pageSession.set("PluginsPlStopLossOutInsertPlStopLossOutInsertFormErrorMessage", "");

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

Template.PluginsPlStopLossOutInsertPlStopLossOutInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlStopLossOutInsertPlStopLossOutInsertFormInfoMessage", "");
		pageSession.set("PluginsPlStopLossOutInsertPlStopLossOutInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlStopLossOutInsertPlStopLossOutInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlStopLossOutInsertPlStopLossOutInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlStopLossOutInsertPlStopLossOutInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_stop_loss_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlStopLossOutInsertPlStopLossOutInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlStopLossOutes.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsPlStopLossOutInsertPlStopLossOutInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlStopLossOutInsertPlStopLossOutInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlStopLossOutInsertPlStopLossOutInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	},
	'prefix': function() {
		return this.settings.enPlPrefix ? "PlSLO_" : "";
	}
	
});
