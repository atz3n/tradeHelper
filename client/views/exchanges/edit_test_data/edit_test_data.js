var pageSession = new ReactiveDict();

Template.ExchangesEditTestData.rendered = function() {
	
};

Template.ExchangesEditTestData.events({
	
});

Template.ExchangesEditTestData.helpers({
	
});

Template.ExchangesEditTestDataEditForm.rendered = function() {
	

	pageSession.set("exchangesEditTestDataEditFormInfoMessage", "");
	pageSession.set("exchangesEditTestDataEditFormErrorMessage", "");

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

Template.ExchangesEditTestDataEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exchangesEditTestDataEditFormInfoMessage", "");
		pageSession.set("exchangesEditTestDataEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var exchangesEditTestDataEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(exchangesEditTestDataEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exchangesEditTestDataEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("exchangesEditTestDataEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				TestDatas.update({ _id: t.data.test_data._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ExchangesEditTestDataEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("exchangesEditTestDataEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("exchangesEditTestDataEditFormErrorMessage");
	}
	
});
