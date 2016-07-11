var pageSession = new ReactiveDict();

Template.ExchangesDetailsExTestData.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.ExchangesDetailsExTestData.events({
	
});

Template.ExchangesDetailsExTestData.helpers({
	
});

Template.ExchangesDetailsExTestDataDetailsForm.rendered = function() {
	

	pageSession.set("exchangesDetailsExTestDataDetailsFormInfoMessage", "");
	pageSession.set("exchangesDetailsExTestDataDetailsFormErrorMessage", "");

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

Template.ExchangesDetailsExTestDataDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exchangesDetailsExTestDataDetailsFormInfoMessage", "");
		pageSession.set("exchangesDetailsExTestDataDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var exchangesDetailsExTestDataDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(exchangesDetailsExTestDataDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exchangesDetailsExTestDataDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("exchangesDetailsExTestDataDetailsFormErrorMessage", message);
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

		Router.go("exchanges", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("exchanges", {});
	}

	
});

Template.ExchangesDetailsExTestDataDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("exchangesDetailsExTestDataDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("exchangesDetailsExTestDataDetailsFormErrorMessage");
	},
	'enError': function() {
		return Meteor.settings.public.ExTestDataErrorConfig;
	}
	
});
