var pageSession = new ReactiveDict();

Template.DevelopEditSettings.rendered = function() {
	
};

Template.DevelopEditSettings.events({
	
});

Template.DevelopEditSettings.helpers({
	
});

Template.DevelopEditSettingsEditForm.rendered = function() {
	

	pageSession.set("developEditSettingsEditFormInfoMessage", "");
	pageSession.set("developEditSettingsEditFormErrorMessage", "");

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

Template.DevelopEditSettingsEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("developEditSettingsEditFormInfoMessage", "");
		pageSession.set("developEditSettingsEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var developEditSettingsEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(developEditSettingsEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("developEditSettingsEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("develop", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("developEditSettingsEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Settings.update({ _id: t.data.setting._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("develop", {});
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

Template.DevelopEditSettingsEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("developEditSettingsEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("developEditSettingsEditFormErrorMessage");
	}
	
});
