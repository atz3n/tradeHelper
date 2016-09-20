var pageSession = new ReactiveDict();

Template.PluginsInsertPlTakeProfit.rendered = function() {
	
};

Template.PluginsInsertPlTakeProfit.events({
	
});

Template.PluginsInsertPlTakeProfit.helpers({
	
});

Template.PluginsInsertPlTakeProfitInsertForm.rendered = function() {
	

	pageSession.set("pluginsInsertPlTakeProfitInsertFormInfoMessage", "");
	pageSession.set("pluginsInsertPlTakeProfitInsertFormErrorMessage", "");

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

Template.PluginsInsertPlTakeProfitInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsInsertPlTakeProfitInsertFormInfoMessage", "");
		pageSession.set("pluginsInsertPlTakeProfitInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsInsertPlTakeProfitInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsInsertPlTakeProfitInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsInsertPlTakeProfitInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsInsertPlTakeProfitInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlTakeProfits.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsInsertPlTakeProfitInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsInsertPlTakeProfitInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsInsertPlTakeProfitInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
