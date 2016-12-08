var pageSession = new ReactiveDict();

Template.ExchangesExTestDataDetailsExTestData.rendered = function() {
	
	Session.set('activePage', 'exchanges');
};

Template.ExchangesExTestDataDetailsExTestData.events({
	
});

Template.ExchangesExTestDataDetailsExTestData.helpers({
	
});


Template.ExchangesExTestDataDetailsExTestDataDetailsForm.rendered = function() {
	

	pageSession.set("ExchangesExTestDataDetailsExTestDataDetailsFormInfoMessage", "");
	pageSession.set("ExchangesExTestDataDetailsExTestDataDetailsFormErrorMessage", "");

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

Template.ExchangesExTestDataDetailsExTestDataDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ExchangesExTestDataDetailsExTestDataDetailsFormInfoMessage", "");
		pageSession.set("ExchangesExTestDataDetailsExTestDataDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ExchangesExTestDataDetailsExTestDataDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(ExchangesExTestDataDetailsExTestDataDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ExchangesExTestDataDetailsExTestDataDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ExchangesExTestDataDetailsExTestDataDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("exchanges.ex_test_data", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("exchanges.ex_test_data", {});
	}

	
});

Template.ExchangesExTestDataDetailsExTestDataDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ExchangesExTestDataDetailsExTestDataDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ExchangesExTestDataDetailsExTestDataDetailsFormErrorMessage");
	},
	'enError': function() {
		return Meteor.settings.public.ExTestDataErrorConfig;
	}
	
});
