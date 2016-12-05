var pageSession = new ReactiveDict();

Template.ExchangesKrakenComDetailsExKraken.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.ExchangesKrakenComDetailsExKraken.events({
	
});

Template.ExchangesKrakenComDetailsExKraken.helpers({
	
});


Template.ExchangesKrakenComDetailsExKrakenDetailsForm.rendered = function() {
	

	pageSession.set("ExchangesKrakenComDetailsExKrakenDetailsFormInfoMessage", "");
	pageSession.set("ExchangesKrakenComDetailsExKrakenDetailsFormErrorMessage", "");

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

Template.ExchangesKrakenComDetailsExKrakenDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ExchangesKrakenComDetailsExKrakenDetailsFormInfoMessage", "");
		pageSession.set("ExchangesKrakenComDetailsExKrakenDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ExchangesKrakenComDetailsExKrakenDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(ExchangesKrakenComDetailsExKrakenDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ExchangesKrakenComDetailsExKrakenDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ExchangesKrakenComDetailsExKrakenDetailsFormErrorMessage", message);
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

		Router.go("exchanges.kraken_com", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("exchanges.kraken_com", {});
	}

	
});

Template.ExchangesKrakenComDetailsExKrakenDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ExchangesKrakenComDetailsExKrakenDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ExchangesKrakenComDetailsExKrakenDetailsFormErrorMessage");
	}
	
});
