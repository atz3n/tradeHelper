var pageSession = new ReactiveDict();

Template.PluginsPlThresholdInInsertPlThresholdIn.rendered = function() {
	
};

Template.PluginsPlThresholdInInsertPlThresholdIn.events({
	
});

Template.PluginsPlThresholdInInsertPlThresholdIn.helpers({
	
});

Template.PluginsPlThresholdInInsertPlThresholdInInsertForm.rendered = function() {
	

	pageSession.set("PluginsPlThresholdInInsertPlThresholdInInsertFormInfoMessage", "");
	pageSession.set("PluginsPlThresholdInInsertPlThresholdInInsertFormErrorMessage", "");

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

Template.PluginsPlThresholdInInsertPlThresholdInInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlThresholdInInsertPlThresholdInInsertFormInfoMessage", "");
		pageSession.set("PluginsPlThresholdInInsertPlThresholdInInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlThresholdInInsertPlThresholdInInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlThresholdInInsertPlThresholdInInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlThresholdInInsertPlThresholdInInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_threshold_in", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlThresholdInInsertPlThresholdInInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlThresholdIns.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsPlThresholdInInsertPlThresholdInInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlThresholdInInsertPlThresholdInInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlThresholdInInsertPlThresholdInInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	},
	'prefix': function() {
		return this.settings.enPlPrefix ? "PlThI_" : "";
	}
	
});
