var pageSession = new ReactiveDict();

Template.PluginsPlSafetyLineOutEditPlSafetyLineOut.rendered = function() {
	
};

Template.PluginsPlSafetyLineOutEditPlSafetyLineOut.events({
	
});

Template.PluginsPlSafetyLineOutEditPlSafetyLineOut.helpers({
	
});

Template.PluginsPlSafetyLineOutEditPlSafetyLineOutEditForm.rendered = function() {
	

	pageSession.set("pluginsPlSafetyLineOutEditPlSafetyLineOutEditFormInfoMessage", "");
	pageSession.set("pluginsPlSafetyLineOutEditPlSafetyLineOutEditFormErrorMessage", "");

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

Template.PluginsPlSafetyLineOutEditPlSafetyLineOutEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsPlSafetyLineOutEditPlSafetyLineOutEditFormInfoMessage", "");
		pageSession.set("pluginsPlSafetyLineOutEditPlSafetyLineOutEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsPlSafetyLineOutEditPlSafetyLineOutEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsPlSafetyLineOutEditPlSafetyLineOutEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsPlSafetyLineOutEditPlSafetyLineOutEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_safety_line_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsPlSafetyLineOutEditPlSafetyLineOutEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlSafetyLineOuts.update({ _id: t.data.pl_safety_line_out._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("plugins.pl_safety_line_out", {});
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

Template.PluginsPlSafetyLineOutEditPlSafetyLineOutEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsPlSafetyLineOutEditPlSafetyLineOutEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsPlSafetyLineOutEditPlSafetyLineOutEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
