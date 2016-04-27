var pageSession = new ReactiveDict();

Template.ExchangesDetailsKraken.rendered = function() {
	
};

Template.ExchangesDetailsKraken.events({
	
});

Template.ExchangesDetailsKraken.helpers({
	
});

Template.ExchangesDetailsKrakenDetailsForm.rendered = function() {
	

	pageSession.set("exchangesDetailsKrakenDetailsFormInfoMessage", "");
	pageSession.set("exchangesDetailsKrakenDetailsFormErrorMessage", "");

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

Template.ExchangesDetailsKrakenDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exchangesDetailsKrakenDetailsFormInfoMessage", "");
		pageSession.set("exchangesDetailsKrakenDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var exchangesDetailsKrakenDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(exchangesDetailsKrakenDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exchangesDetailsKrakenDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("exchangesDetailsKrakenDetailsFormErrorMessage", message);
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

Template.ExchangesDetailsKrakenDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("exchangesDetailsKrakenDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("exchangesDetailsKrakenDetailsFormErrorMessage");
	}
	
});
