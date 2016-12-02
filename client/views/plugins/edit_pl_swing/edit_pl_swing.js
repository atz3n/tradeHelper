var pageSession = new ReactiveDict();

Template.PluginsEditPlSwing.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsEditPlSwing.events({
	
});

Template.PluginsEditPlSwing.helpers({
	
});

Template.PluginsEditPlSwingEditForm.rendered = function() {
	

	pageSession.set("pluginsEditPlSwingEditFormInfoMessage", "");
	pageSession.set("pluginsEditPlSwingEditFormErrorMessage", "");

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

Template.PluginsEditPlSwingEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsEditPlSwingEditFormInfoMessage", "");
		pageSession.set("pluginsEditPlSwingEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsEditPlSwingEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsEditPlSwingEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsEditPlSwingEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsEditPlSwingEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlSwings.update({ _id: t.data.pl_swing._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsEditPlSwingEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsEditPlSwingEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsEditPlSwingEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
	
});
