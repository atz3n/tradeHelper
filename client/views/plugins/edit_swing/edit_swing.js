var pageSession = new ReactiveDict();

Template.PluginsEditSwing.rendered = function() {
	
};

Template.PluginsEditSwing.events({
	
});

Template.PluginsEditSwing.helpers({
	
});

Template.PluginsEditSwingEditForm.rendered = function() {
	

	pageSession.set("pluginsEditSwingEditFormInfoMessage", "");
	pageSession.set("pluginsEditSwingEditFormErrorMessage", "");

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

Template.PluginsEditSwingEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsEditSwingEditFormInfoMessage", "");
		pageSession.set("pluginsEditSwingEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsEditSwingEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsEditSwingEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsEditSwingEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsEditSwingEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Swings.update({ _id: t.data.swing._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsEditSwingEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsEditSwingEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsEditSwingEditFormErrorMessage");
	}
	
});
