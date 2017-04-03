var pageSession = new ReactiveDict();

Template.PluginsPlTrailingStopOutEditPlTrailingStopOut.rendered = function() {
	
};

Template.PluginsPlTrailingStopOutEditPlTrailingStopOut.events({
	
});

Template.PluginsPlTrailingStopOutEditPlTrailingStopOut.helpers({
	
});

Template.PluginsPlTrailingStopOutEditPlTrailingStopOutEditForm.rendered = function() {
	

	pageSession.set("PluginsPlTrailingStopOutEditPlTrailingStopOutEditFormInfoMessage", "");
	pageSession.set("PluginsPlTrailingStopOutEditPlTrailingStopOutEditFormErrorMessage", "");

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

Template.PluginsPlTrailingStopOutEditPlTrailingStopOutEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTrailingStopOutEditPlTrailingStopOutEditFormInfoMessage", "");
		pageSession.set("PluginsPlTrailingStopOutEditPlTrailingStopOutEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTrailingStopOutEditPlTrailingStopOutEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTrailingStopOutEditPlTrailingStopOutEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTrailingStopOutEditPlTrailingStopOutEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_trailing_stop_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTrailingStopOutEditPlTrailingStopOutEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlTrailingStopOuts.update({ _id: t.data.pl_trailing_stop_out._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsPlTrailingStopOutEditPlTrailingStopOutEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTrailingStopOutEditPlTrailingStopOutEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTrailingStopOutEditPlTrailingStopOutEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
