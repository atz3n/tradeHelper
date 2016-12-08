var pageSession = new ReactiveDict();

Template.PluginsPlThresholdOutInsertPlThresholdOut.rendered = function() {
	
};

Template.PluginsPlThresholdOutInsertPlThresholdOut.events({
	
});

Template.PluginsPlThresholdOutInsertPlThresholdOut.helpers({
	
});

Template.PluginsPlThresholdOutInsertPlThresholdOutInsertForm.rendered = function() {
	

	pageSession.set("PluginsPlThresholdOutInsertPlThresholdOutInsertFormInfoMessage", "");
	pageSession.set("PluginsPlThresholdOutInsertPlThresholdOutInsertFormErrorMessage", "");

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

Template.PluginsPlThresholdOutInsertPlThresholdOutInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlThresholdOutInsertPlThresholdOutInsertFormInfoMessage", "");
		pageSession.set("PluginsPlThresholdOutInsertPlThresholdOutInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlThresholdOutInsertPlThresholdOutInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlThresholdOutInsertPlThresholdOutInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlThresholdOutInsertPlThresholdOutInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_threshold_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlThresholdOutInsertPlThresholdOutInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlThresholdOuts.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsPlThresholdOutInsertPlThresholdOutInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlThresholdOutInsertPlThresholdOutInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlThresholdOutInsertPlThresholdOutInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
