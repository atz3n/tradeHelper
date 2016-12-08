var pageSession = new ReactiveDict();

Template.PluginsPlTakeProfitInsertPlTakeProfit.rendered = function() {
	
};

Template.PluginsPlTakeProfitInsertPlTakeProfit.events({
	
});

Template.PluginsPlTakeProfitInsertPlTakeProfit.helpers({
	
});

Template.PluginsPlTakeProfitInsertPlTakeProfitInsertForm.rendered = function() {
	

	pageSession.set("PluginsPlTakeProfitInsertPlTakeProfitInsertFormInfoMessage", "");
	pageSession.set("PluginsPlTakeProfitInsertPlTakeProfitInsertFormErrorMessage", "");

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

Template.PluginsPlTakeProfitInsertPlTakeProfitInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTakeProfitInsertPlTakeProfitInsertFormInfoMessage", "");
		pageSession.set("PluginsPlTakeProfitInsertPlTakeProfitInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTakeProfitInsertPlTakeProfitInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTakeProfitInsertPlTakeProfitInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTakeProfitInsertPlTakeProfitInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_take_profit", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTakeProfitInsertPlTakeProfitInsertFormErrorMessage", message);
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

		

		Router.go("plugins.pl_take_profit", {});
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

Template.PluginsPlTakeProfitInsertPlTakeProfitInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTakeProfitInsertPlTakeProfitInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTakeProfitInsertPlTakeProfitInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
