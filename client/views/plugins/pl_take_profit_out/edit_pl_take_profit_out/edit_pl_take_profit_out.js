var pageSession = new ReactiveDict();

Template.PluginsPlTakeProfitOutEditPlTakeProfitOut.rendered = function() {
	
};

Template.PluginsPlTakeProfitOutEditPlTakeProfitOut.events({
	
});

Template.PluginsPlTakeProfitOutEditPlTakeProfitOut.helpers({
	
});

Template.PluginsPlTakeProfitOutEditPlTakeProfitOutEditForm.rendered = function() {
	

	pageSession.set("PluginsPlTakeProfitOutEditPlTakeProfitOutEditFormInfoMessage", "");
	pageSession.set("PluginsPlTakeProfitOutEditPlTakeProfitOutEditFormErrorMessage", "");

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

Template.PluginsPlTakeProfitOutEditPlTakeProfitOutEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTakeProfitOutEditPlTakeProfitOutEditFormInfoMessage", "");
		pageSession.set("PluginsPlTakeProfitOutEditPlTakeProfitOutEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTakeProfitOutEditPlTakeProfitOutEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTakeProfitOutEditPlTakeProfitOutEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTakeProfitOutEditPlTakeProfitOutEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_take_profit_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTakeProfitOutEditPlTakeProfitOutEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlTakeProfitOuts.update({ _id: t.data.pl_take_profit_out._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("plugins.pl_take_profit_out", {});
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

Template.PluginsPlTakeProfitOutEditPlTakeProfitOutEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTakeProfitOutEditPlTakeProfitOutEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTakeProfitOutEditPlTakeProfitOutEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
