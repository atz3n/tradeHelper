var pageSession = new ReactiveDict();

Template.ExchangesExTestDataInsertExTestData.rendered = function() {

};

Template.ExchangesExTestDataInsertExTestData.events({
	
});

Template.ExchangesExTestDataInsertExTestData.helpers({
	
});

Template.ExchangesExTestDataInsertExTestDataInsertForm.rendered = function() {
	

	pageSession.set("exchangesExTestDataInsertExTestDataInsertFormInfoMessage", "");
	pageSession.set("exchangesExTestDataInsertExTestDataInsertFormErrorMessage", "");

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

Template.ExchangesExTestDataInsertExTestDataInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exchangesExTestDataInsertExTestDataInsertFormInfoMessage", "");
		pageSession.set("exchangesExTestDataInsertExTestDataInsertFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var exchangesExTestDataInsertExTestDataInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(exchangesExTestDataInsertExTestDataInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exchangesExTestDataInsertExTestDataInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges.ex_test_data", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("exchangesExTestDataInsertExTestDataInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("exTestDatasInsert", values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("exchanges.ex_test_data", mergeObjects(Router.currentRouteParams(), {}));
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

Template.ExchangesExTestDataInsertExTestDataInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("exchangesExTestDataInsertExTestDataInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("exchangesExTestDataInsertExTestDataInsertFormErrorMessage");
	}
	
});

Template.ExchangesExTestDataInsertExTestDataInsertForm.rendered = function() {
	
	pageSession.set("ExchangesExTestDataInsertExTestDataInsertFormInfoMessage", "");
	pageSession.set("ExchangesExTestDataInsertExTestDataInsertFormErrorMessage", "");

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

Template.ExchangesExTestDataInsertExTestDataInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ExchangesExTestDataInsertExTestDataInsertFormInfoMessage", "");
		pageSession.set("ExchangesExTestDataInsertExTestDataInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ExchangesExTestDataInsertExTestDataInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(ExchangesExTestDataInsertExTestDataInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ExchangesExTestDataInsertExTestDataInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges.ex_test_data", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ExchangesExTestDataInsertExTestDataInsertFormErrorMessage", message);
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

		

		Router.go("exchanges.ex_test_data", {});
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

Template.ExchangesExTestDataInsertExTestDataInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ExchangesExTestDataInsertExTestDataInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ExchangesExTestDataInsertExTestDataInsertFormErrorMessage");
	},
	'pairs': function() {
		return this.exTestData_tradePairs.pairs;
	},
	'enError': function() {
		return Meteor.settings.public.ExTestDataErrorConfig;
	}
});
