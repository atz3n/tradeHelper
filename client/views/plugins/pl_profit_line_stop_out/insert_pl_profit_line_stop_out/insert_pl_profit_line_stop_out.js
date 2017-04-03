var pageSession = new ReactiveDict();

Template.PluginsPlProfitLineStopOutInsertPlProfitLineStopOut.rendered = function() {
	
};

Template.PluginsPlProfitLineStopOutInsertPlProfitLineStopOut.events({
	
});

Template.PluginsPlProfitLineStopOutInsertPlProfitLineStopOut.helpers({
	
});

Template.PluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertForm.rendered = function() {
	

	pageSession.set("pluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertFormInfoMessage", "");
	pageSession.set("pluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertFormErrorMessage", "");

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

Template.PluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertFormInfoMessage", "");
		pageSession.set("pluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_profit_line_stop_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlProfitLineStopOuts.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("plugins.pl_profit_line_stop_out", {});
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

Template.PluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsPlProfitLineStopOutInsertPlProfitLineStopOutInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	},
	'prefix': function() {
		return this.settings.enPlPrefix ? "PlPSO_" : "";
	}
	
});
