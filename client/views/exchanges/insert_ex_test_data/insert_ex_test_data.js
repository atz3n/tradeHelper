var pageSession = new ReactiveDict();

Template.ExchangesInsertExTestData.rendered = function() {
	
};

Template.ExchangesInsertExTestData.events({
	
});

Template.ExchangesInsertExTestData.helpers({
	
});

Template.ExchangesInsertExTestDataInsertForm.rendered = function() {
	

	pageSession.set("exchangesInsertExTestDataInsertFormInfoMessage", "");
	pageSession.set("exchangesInsertExTestDataInsertFormErrorMessage", "");

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

Template.ExchangesInsertExTestDataInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exchangesInsertExTestDataInsertFormInfoMessage", "");
		pageSession.set("exchangesInsertExTestDataInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var exchangesInsertExTestDataInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(exchangesInsertExTestDataInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exchangesInsertExTestDataInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("exchangesInsertExTestDataInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = ExTestDatas.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("exchanges", {});
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

Template.ExchangesInsertExTestDataInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("exchangesInsertExTestDataInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("exchangesInsertExTestDataInsertFormErrorMessage");
	}
	
});
