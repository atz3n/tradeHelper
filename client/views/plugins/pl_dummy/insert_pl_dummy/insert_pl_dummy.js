var pageSession = new ReactiveDict();

Template.PluginsPlDummyInsertPlDummy.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlDummyInsertPlDummy.events({
	
});

Template.PluginsPlDummyInsertPlDummy.helpers({
	
});

Template.PluginsPlDummyInsertPlDummyInsertForm.rendered = function() {
	

	pageSession.set("pluginsPlDummyInsertPlDummyInsertFormInfoMessage", "");
	pageSession.set("pluginsPlDummyInsertPlDummyInsertFormErrorMessage", "");

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

Template.PluginsPlDummyInsertPlDummyInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsPlDummyInsertPlDummyInsertFormInfoMessage", "");
		pageSession.set("pluginsPlDummyInsertPlDummyInsertFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var pluginsPlDummyInsertPlDummyInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsPlDummyInsertPlDummyInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsPlDummyInsertPlDummyInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_dummy", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsPlDummyInsertPlDummyInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlDummies.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("plugins.pl_dummy", {});
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

Template.PluginsPlDummyInsertPlDummyInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsPlDummyInsertPlDummyInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsPlDummyInsertPlDummyInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	},
	'prefix': function() {
		return this.settings.enPlPrefix ? "PlDum_" : "";
	}
	
});
