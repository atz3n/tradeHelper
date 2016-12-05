var pageSession = new ReactiveDict();

Template.PluginsEditPlThresholdIn.rendered = function() {
	
};

Template.PluginsEditPlThresholdIn.events({
	
});

Template.PluginsEditPlThresholdIn.helpers({
	
});

Template.PluginsEditPlThresholdInEditForm.rendered = function() {
	

	pageSession.set("pluginsEditPlThresholdInEditFormInfoMessage", "");
	pageSession.set("pluginsEditPlThresholdInEditFormErrorMessage", "");

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

Template.PluginsEditPlThresholdInEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsEditPlThresholdInEditFormInfoMessage", "");
		pageSession.set("pluginsEditPlThresholdInEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsEditPlThresholdInEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsEditPlThresholdInEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsEditPlThresholdInEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsEditPlThresholdInEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlThresholdIns.update({ _id: t.data.pl_threshold_in._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsEditPlThresholdInEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsEditPlThresholdInEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsEditPlThresholdInEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
