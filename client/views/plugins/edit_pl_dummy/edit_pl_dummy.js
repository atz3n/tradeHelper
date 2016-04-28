var pageSession = new ReactiveDict();

Template.PluginsEditPlDummy.rendered = function() {
	
};

Template.PluginsEditPlDummy.events({
	
});

Template.PluginsEditPlDummy.helpers({
	
});

Template.PluginsEditPlDummyEditForm.rendered = function() {
	

	pageSession.set("pluginsEditPlDummyEditFormInfoMessage", "");
	pageSession.set("pluginsEditPlDummyEditFormErrorMessage", "");

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

Template.PluginsEditPlDummyEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsEditPlDummyEditFormInfoMessage", "");
		pageSession.set("pluginsEditPlDummyEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsEditPlDummyEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsEditPlDummyEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsEditPlDummyEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsEditPlDummyEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlDummys.update({ _id: t.data.pl_dummy._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsEditPlDummyEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsEditPlDummyEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsEditPlDummyEditFormErrorMessage");
	}
	
});
