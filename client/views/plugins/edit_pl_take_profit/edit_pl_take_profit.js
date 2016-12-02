var pageSession = new ReactiveDict();

Template.PluginsEditPlTakeProfit.rendered = function() {
	
};

Template.PluginsEditPlTakeProfit.events({
	
});

Template.PluginsEditPlTakeProfit.helpers({
	
});

Template.PluginsEditPlTakeProfitEditForm.rendered = function() {
	

	pageSession.set("pluginsEditPlTakeProfitEditFormInfoMessage", "");
	pageSession.set("pluginsEditPlTakeProfitEditFormErrorMessage", "");

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

Template.PluginsEditPlTakeProfitEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsEditPlTakeProfitEditFormInfoMessage", "");
		pageSession.set("pluginsEditPlTakeProfitEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsEditPlTakeProfitEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsEditPlTakeProfitEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsEditPlTakeProfitEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsEditPlTakeProfitEditFormErrorMessage", message);
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

Template.PluginsEditPlTakeProfitEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsEditPlTakeProfitEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsEditPlTakeProfitEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
