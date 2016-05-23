var pageSession = new ReactiveDict();

Template.HistoryDetails.rendered = function() {
	
};

Template.HistoryDetails.events({
	
});

Template.HistoryDetails.helpers({
	
});

Template.HistoryDetailsDetailsForm.rendered = function() {
	

	pageSession.set("historyDetailsDetailsFormInfoMessage", "");
	pageSession.set("historyDetailsDetailsFormErrorMessage", "");

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

Template.HistoryDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("historyDetailsDetailsFormInfoMessage", "");
		pageSession.set("historyDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var historyDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(historyDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("historyDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("historyDetailsDetailsFormErrorMessage", message);
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

		Router.go("history", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("history", {});
	}

	
});

Template.HistoryDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("historyDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("historyDetailsDetailsFormErrorMessage");
	}
	
});
