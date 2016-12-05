var pageSession = new ReactiveDict();

Template.ExchangesTestDataInsertExTestData.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.ExchangesTestDataInsertExTestData.events({
	
});

Template.ExchangesTestDataInsertExTestData.helpers({
	
});


Template.ExchangesTestDataInsertExTestDataInsertForm.rendered = function() {
	
	pageSession.set("ExchangesTestDataInsertExTestDataInsertFormInfoMessage", "");
	pageSession.set("ExchangesTestDataInsertExTestDataInsertFormErrorMessage", "");

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

Template.ExchangesTestDataInsertExTestDataInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ExchangesTestDataInsertExTestDataInsertFormInfoMessage", "");
		pageSession.set("ExchangesTestDataInsertExTestDataInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ExchangesTestDataInsertExTestDataInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(ExchangesTestDataInsertExTestDataInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ExchangesTestDataInsertExTestDataInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges.test_data", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ExchangesTestDataInsertExTestDataInsertFormErrorMessage", message);
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

		

		Router.go("exchanges.test_data", {});
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

Template.ExchangesTestDataInsertExTestDataInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ExchangesTestDataInsertExTestDataInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ExchangesTestDataInsertExTestDataInsertFormErrorMessage");
	},
	'pairs': function() {
		return this.exTestData_tradePairs.pairs;
	},
	'enError': function() {
		return Meteor.settings.public.ExTestDataErrorConfig;
	}
});
