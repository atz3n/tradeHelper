var pageSession = new ReactiveDict();

Template.PluginsPlSafetyLineOutInsertPlSafetyLineOut.rendered = function() {
	
};

Template.PluginsPlSafetyLineOutInsertPlSafetyLineOut.events({
	
});

Template.PluginsPlSafetyLineOutInsertPlSafetyLineOut.helpers({
	
});

Template.PluginsPlSafetyLineOutInsertPlSafetyLineOutInsertForm.rendered = function() {
	

	pageSession.set("pluginsPlSafetyLineOutInsertPlSafetyLineOutInsertFormInfoMessage", "");
	pageSession.set("pluginsPlSafetyLineOutInsertPlSafetyLineOutInsertFormErrorMessage", "");

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

Template.PluginsPlSafetyLineOutInsertPlSafetyLineOutInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsPlSafetyLineOutInsertPlSafetyLineOutInsertFormInfoMessage", "");
		pageSession.set("pluginsPlSafetyLineOutInsertPlSafetyLineOutInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsPlSafetyLineOutInsertPlSafetyLineOutInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsPlSafetyLineOutInsertPlSafetyLineOutInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsPlSafetyLineOutInsertPlSafetyLineOutInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_safety_line_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsPlSafetyLineOutInsertPlSafetyLineOutInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlSafetyLineOuts.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsPlSafetyLineOutInsertPlSafetyLineOutInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsPlSafetyLineOutInsertPlSafetyLineOutInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsPlSafetyLineOutInsertPlSafetyLineOutInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	},
	'prefix': function() {
		return this.settings.enPlPrefix ? "PlSLO_" : "";
	}
	
});
