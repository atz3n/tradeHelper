var pageSession = new ReactiveDict();

Template.PluginsPlTakeProfitOutInsertPlTakeProfitOut.rendered = function() {
	
};

Template.PluginsPlTakeProfitOutInsertPlTakeProfitOut.events({
	
});

Template.PluginsPlTakeProfitOutInsertPlTakeProfitOut.helpers({
	
});

Template.PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertForm.rendered = function() {
	

	pageSession.set("PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertFormInfoMessage", "");
	pageSession.set("PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertFormErrorMessage", "");

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

Template.PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertFormInfoMessage", "");
		pageSession.set("PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_take_profit_out", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = PlTakeProfitOuts.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("PluginsPlTakeProfitOutInsertPlTakeProfitOutInsertFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	},
	'prefix': function() {
		return this.settings.enPlPrefix ? "PlTPO_" : "";
	}
	
});
