var pageSession = new ReactiveDict();

Template.PluginsPlProfitLineStopOutEditPlProfitLineStopOut.rendered = function() {
	
};

Template.PluginsPlProfitLineStopOutEditPlProfitLineStopOut.events({
	
});

Template.PluginsPlProfitLineStopOutEditPlProfitLineStopOut.helpers({
	
});

Template.PluginsPlProfitLineStopOutEditPlProfitLineStopOutEditForm.rendered = function() {
	

	pageSession.set("pluginsPlProfitLineStopOutEditPlProfitLineStopOutEditFormInfoMessage", "");
	pageSession.set("pluginsPlProfitLineStopOutEditPlProfitLineStopOutEditFormErrorMessage", "");

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

Template.PluginsPlProfitLineStopOutEditPlProfitLineStopOutEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsPlProfitLineStopOutEditPlProfitLineStopOutEditFormInfoMessage", "");
		pageSession.set("pluginsPlProfitLineStopOutEditPlProfitLineStopOutEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginsPlProfitLineStopOutEditPlProfitLineStopOutEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsPlProfitLineStopOutEditPlProfitLineStopOutEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsPlProfitLineStopOutEditPlProfitLineStopOutEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_profit_line_stop_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsPlProfitLineStopOutEditPlProfitLineStopOutEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlProfitLineStopOuts.update({ _id: t.data.pl_profit_line_stop_out._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsPlProfitLineStopOutEditPlProfitLineStopOutEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsPlProfitLineStopOutEditPlProfitLineStopOutEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsPlProfitLineStopOutEditPlProfitLineStopOutEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
