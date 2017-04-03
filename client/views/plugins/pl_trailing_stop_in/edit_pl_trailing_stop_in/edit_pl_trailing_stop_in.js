var pageSession = new ReactiveDict();

Template.PluginsPlTrailingStopInEditPlTrailingStopIn.rendered = function() {
	
};

Template.PluginsPlTrailingStopInEditPlTrailingStopIn.events({
	
});

Template.PluginsPlTrailingStopInEditPlTrailingStopIn.helpers({
	
});

Template.PluginsPlTrailingStopInEditPlTrailingStopInEditForm.rendered = function() {
	

	pageSession.set("PluginsPlTrailingStopInEditPlTrailingStopInEditFormInfoMessage", "");
	pageSession.set("PluginsPlTrailingStopInEditPlTrailingStopInEditFormErrorMessage", "");

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

Template.PluginsPlTrailingStopInEditPlTrailingStopInEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTrailingStopInEditPlTrailingStopInEditFormInfoMessage", "");
		pageSession.set("PluginsPlTrailingStopInEditPlTrailingStopInEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTrailingStopInEditPlTrailingStopInEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTrailingStopInEditPlTrailingStopInEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTrailingStopInEditPlTrailingStopInEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_trailing_stop_in", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTrailingStopInEditPlTrailingStopInEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlTrailingStopIns.update({ _id: t.data.pl_trailing_stop_in._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsPlTrailingStopInEditPlTrailingStopInEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTrailingStopInEditPlTrailingStopInEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTrailingStopInEditPlTrailingStopInEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
