var pageSession = new ReactiveDict();

Template.PluginsPlThresholdInEditPlThresholdIn.rendered = function() {
	
};

Template.PluginsPlThresholdInEditPlThresholdIn.events({
	
});

Template.PluginsPlThresholdInEditPlThresholdIn.helpers({
	
});

Template.PluginsPlThresholdInEditPlThresholdInEditForm.rendered = function() {
	

	pageSession.set("PluginsPlThresholdInEditPlThresholdInEditFormInfoMessage", "");
	pageSession.set("PluginsPlThresholdInEditPlThresholdInEditFormErrorMessage", "");

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

Template.PluginsPlThresholdInEditPlThresholdInEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlThresholdInEditPlThresholdInEditFormInfoMessage", "");
		pageSession.set("PluginsPlThresholdInEditPlThresholdInEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlThresholdInEditPlThresholdInEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlThresholdInEditPlThresholdInEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlThresholdInEditPlThresholdInEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_threshold_in", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlThresholdInEditPlThresholdInEditFormErrorMessage", message);
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

		

		Router.go("plugins.pl_threshold_in", {});
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

Template.PluginsPlThresholdInEditPlThresholdInEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlThresholdInEditPlThresholdInEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlThresholdInEditPlThresholdInEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
