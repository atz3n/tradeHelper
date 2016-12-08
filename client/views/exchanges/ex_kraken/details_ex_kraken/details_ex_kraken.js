var pageSession = new ReactiveDict();

Template.ExchangesExKrakenDetailsExKraken.rendered = function() {

};

Template.ExchangesExKrakenDetailsExKraken.events({
	
});

Template.ExchangesExKrakenDetailsExKraken.helpers({
	
});

Template.ExchangesExKrakenDetailsExKrakenDetailsForm.rendered = function() {
	

	pageSession.set("ExchangesExKrakenDetailsExKrakenDetailsFormInfoMessage", "");
	pageSession.set("ExchangesExKrakenDetailsExKrakenDetailsFormErrorMessage", "");

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

Template.ExchangesExKrakenDetailsExKrakenDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ExchangesExKrakenDetailsExKrakenDetailsFormInfoMessage", "");
		pageSession.set("ExchangesExKrakenDetailsExKrakenDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ExchangesExKrakenDetailsExKrakenDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(ExchangesExKrakenDetailsExKrakenDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ExchangesExKrakenDetailsExKrakenDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ExchangesExKrakenDetailsExKrakenDetailsFormErrorMessage", message);
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

		Router.go("exchanges.ex_kraken", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("exchanges.ex_kraken", {});
	}

	
});

Template.ExchangesExKrakenDetailsExKrakenDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ExchangesExKrakenDetailsExKrakenDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ExchangesExKrakenDetailsExKrakenDetailsFormErrorMessage");
	}
	
});
