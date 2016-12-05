var pageSession = new ReactiveDict();

Template.PluginsInsertPlThresholdIn.rendered = function() {
	
};

Template.PluginsInsertPlThresholdIn.events({
	
});

Template.PluginsInsertPlThresholdIn.helpers({
	
});

Template.PluginsInsertPlThresholdInInsertForm.rendered = function() {
	

	pageSession.set("pluginsInsertPlThresholdInInsertFormInfoMessage", "");
	pageSession.set("pluginsInsertPlThresholdInInsertFormErrorMessage", "");

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

Template.PluginsInsertPlThresholdInInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsInsertPlThresholdInInsertFormInfoMessage", "");
		pageSession.set("pluginsInsertPlThresholdInInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsInsertPlThresholdInInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsInsertPlThresholdInInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsInsertPlThresholdInInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsInsertPlThresholdInInsertFormErrorMessage", message);
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

Template.PluginsInsertPlThresholdInInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsInsertPlThresholdInInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsInsertPlThresholdInInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
