var pageSession = new ReactiveDict();

Template.PluginsInsertPlSwing.rendered = function() {
	
};

Template.PluginsInsertPlSwing.events({
	
});

Template.PluginsInsertPlSwing.helpers({
	
});

Template.PluginsInsertPlSwingInsertForm.rendered = function() {
	

	pageSession.set("pluginsInsertPlSwingInsertFormInfoMessage", "");
	pageSession.set("pluginsInsertPlSwingInsertFormErrorMessage", "");

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

Template.PluginsInsertPlSwingInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsInsertPlSwingInsertFormInfoMessage", "");
		pageSession.set("pluginsInsertPlSwingInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsInsertPlSwingInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsInsertPlSwingInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsInsertPlSwingInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsInsertPlSwingInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlSwings.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsInsertPlSwingInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsInsertPlSwingInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsInsertPlSwingInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
