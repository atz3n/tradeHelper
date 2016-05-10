var pageSession = new ReactiveDict();

Template.Settings.rendered = function() {
	console.log(Settings.findOne())
};

Template.Settings.events({
	
});

Template.Settings.helpers({
	
});

Template.SettingsEditForm.rendered = function() {
	

	pageSession.set("settingsEditFormInfoMessage", "");
	pageSession.set("settingsEditFormErrorMessage", "");

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

Template.SettingsEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("settingsEditFormInfoMessage", "");
		pageSession.set("settingsEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var settingsEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(settingsEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("settingsEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("settings", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("settingsEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Settings.update({ _id: t.data.settings_first._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.SettingsEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("settingsEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("settingsEditFormErrorMessage");
	}
	
});
