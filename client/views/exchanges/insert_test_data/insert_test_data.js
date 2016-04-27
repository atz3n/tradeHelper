var pageSession = new ReactiveDict();

Template.ExchangesInsertTestData.rendered = function() {
	
};

Template.ExchangesInsertTestData.events({
	
});

Template.ExchangesInsertTestData.helpers({
	
});

Template.ExchangesInsertTestDataInsertForm.rendered = function() {
	

	pageSession.set("exchangesInsertTestDataInsertFormInfoMessage", "");
	pageSession.set("exchangesInsertTestDataInsertFormErrorMessage", "");

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

Template.ExchangesInsertTestDataInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exchangesInsertTestDataInsertFormInfoMessage", "");
		pageSession.set("exchangesInsertTestDataInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var exchangesInsertTestDataInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(exchangesInsertTestDataInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exchangesInsertTestDataInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("exchangesInsertTestDataInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = TestDatas.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ExchangesInsertTestDataInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("exchangesInsertTestDataInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("exchangesInsertTestDataInsertFormErrorMessage");
	}
	
});
