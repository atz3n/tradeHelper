var pageSession = new ReactiveDict();

Template.PluginsInsertPlThresholdOut.rendered = function() {
	
};

Template.PluginsInsertPlThresholdOut.events({
	
});

Template.PluginsInsertPlThresholdOut.helpers({
	
});

Template.PluginsInsertPlThresholdOutInsertForm.rendered = function() {
	

	pageSession.set("pluginsInsertPlThresholdOutInsertFormInfoMessage", "");
	pageSession.set("pluginsInsertPlThresholdOutInsertFormErrorMessage", "");

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

Template.PluginsInsertPlThresholdOutInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsInsertPlThresholdOutInsertFormInfoMessage", "");
		pageSession.set("pluginsInsertPlThresholdOutInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsInsertPlThresholdOutInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsInsertPlThresholdOutInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsInsertPlThresholdOutInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsInsertPlThresholdOutInsertFormErrorMessage", message);
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

Template.PluginsInsertPlThresholdOutInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsInsertPlThresholdOutInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsInsertPlThresholdOutInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
