var pageSession = new ReactiveDict();

Template.PluginsPlTrailingStopInInsertPlTrailingStopIn.rendered = function() {
	
};

Template.PluginsPlTrailingStopInInsertPlTrailingStopIn.events({
	
});

Template.PluginsPlTrailingStopInInsertPlTrailingStopIn.helpers({
	
});

Template.PluginsPlTrailingStopInInsertPlTrailingStopInInsertForm.rendered = function() {
	

	pageSession.set("PluginsPlTrailingStopInInsertPlTrailingStopInInsertFormInfoMessage", "");
	pageSession.set("PluginsPlTrailingStopInInsertPlTrailingStopInInsertFormErrorMessage", "");

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

Template.PluginsPlTrailingStopInInsertPlTrailingStopInInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTrailingStopInInsertPlTrailingStopInInsertFormInfoMessage", "");
		pageSession.set("PluginsPlTrailingStopInInsertPlTrailingStopInInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTrailingStopInInsertPlTrailingStopInInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTrailingStopInInsertPlTrailingStopInInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTrailingStopInInsertPlTrailingStopInInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_trailing_stop_in", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTrailingStopInInsertPlTrailingStopInInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlTrailingStopIns.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("plugins.pl_trailing_stop_in", {});
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

Template.PluginsPlTrailingStopInInsertPlTrailingStopInInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTrailingStopInInsertPlTrailingStopInInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTrailingStopInInsertPlTrailingStopInInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	},
	'prefix': function() {
		return this.settings.enPlPrefix ? "PlTSI_" : "";
	}
	
});
