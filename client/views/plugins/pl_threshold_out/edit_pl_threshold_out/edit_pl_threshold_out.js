var pageSession = new ReactiveDict();

Template.PluginsPlThresholdOutEditPlThresholdOut.rendered = function() {
	
};

Template.PluginsPlThresholdOutEditPlThresholdOut.events({
	
});

Template.PluginsPlThresholdOutEditPlThresholdOut.helpers({
	
});

Template.PluginsPlThresholdOutEditPlThresholdOutEditForm.rendered = function() {
	

	pageSession.set("PluginsPlThresholdOutEditPlThresholdOutEditFormInfoMessage", "");
	pageSession.set("PluginsPlThresholdOutEditPlThresholdOutEditFormErrorMessage", "");

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

Template.PluginsPlThresholdOutEditPlThresholdOutEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlThresholdOutEditPlThresholdOutEditFormInfoMessage", "");
		pageSession.set("PluginsPlThresholdOutEditPlThresholdOutEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlThresholdOutEditPlThresholdOutEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlThresholdOutEditPlThresholdOutEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlThresholdOutEditPlThresholdOutEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_threshold_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlThresholdOutEditPlThresholdOutEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlThresholdOuts.update({ _id: t.data.pl_threshold_out._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("plugins.pl_threshold_out", {});
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

Template.PluginsPlThresholdOutEditPlThresholdOutEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlThresholdOutEditPlThresholdOutEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlThresholdOutEditPlThresholdOutEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
