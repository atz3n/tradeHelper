var pageSession = new ReactiveDict();

Template.PluginsPlTakeProfitEditPlTakeProfit.rendered = function() {
	
};

Template.PluginsPlTakeProfitEditPlTakeProfit.events({
	
});

Template.PluginsPlTakeProfitEditPlTakeProfit.helpers({
	
});

Template.PluginsPlTakeProfitEditPlTakeProfitEditForm.rendered = function() {
	

	pageSession.set("PluginsPlTakeProfitEditPlTakeProfitEditFormInfoMessage", "");
	pageSession.set("PluginsPlTakeProfitEditPlTakeProfitEditFormErrorMessage", "");

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

Template.PluginsPlTakeProfitEditPlTakeProfitEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTakeProfitEditPlTakeProfitEditFormInfoMessage", "");
		pageSession.set("PluginsPlTakeProfitEditPlTakeProfitEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTakeProfitEditPlTakeProfitEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTakeProfitEditPlTakeProfitEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTakeProfitEditPlTakeProfitEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_take_profit", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTakeProfitEditPlTakeProfitEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlTakeProfits.update({ _id: t.data.pl_take_profit._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsPlTakeProfitEditPlTakeProfitEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTakeProfitEditPlTakeProfitEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTakeProfitEditPlTakeProfitEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
