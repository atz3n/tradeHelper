var pageSession = new ReactiveDict();

Template.PluginsPlTrailingStopOutInsertPlTrailingStopOut.rendered = function() {
	
};

Template.PluginsPlTrailingStopOutInsertPlTrailingStopOut.events({
	
});

Template.PluginsPlTrailingStopOutInsertPlTrailingStopOut.helpers({
	
});

Template.PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertForm.rendered = function() {
	

	pageSession.set("PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertFormInfoMessage", "");
	pageSession.set("PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertFormErrorMessage", "");

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

Template.PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertFormInfoMessage", "");
		pageSession.set("PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_trailing_stop_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlTrailingStopOuts.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("plugins.pl_trailing_stop_out", {});
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

Template.PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTrailingStopOutInsertPlTrailingStopOutInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	},
	'prefix': function() {
		return this.settings.enPlPrefix ? "PlTSO_" : "";
	}
	
});
