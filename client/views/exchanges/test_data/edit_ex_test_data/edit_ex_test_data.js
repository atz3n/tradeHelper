var pageSession = new ReactiveDict();

Template.ExchangesTestDataEditExTestData.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.ExchangesTestDataEditExTestData.events({
	
});

Template.ExchangesTestDataEditExTestData.helpers({
	
});

Template.ExchangesTestDataEditExTestDataEditForm.rendered = function() {
	

	pageSession.set("ExchangesTestDataEditExTestDataEditFormInfoMessage", "");
	pageSession.set("ExchangesTestDataEditExTestDataEditFormErrorMessage", "");

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

Template.ExchangesTestDataEditExTestDataEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ExchangesTestDataEditExTestDataEditFormInfoMessage", "");
		pageSession.set("ExchangesTestDataEditExTestDataEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ExchangesTestDataEditExTestDataEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(ExchangesTestDataEditExTestDataEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ExchangesTestDataEditExTestDataEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges.test_data", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ExchangesTestDataEditExTestDataEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				ExTestDatas.update({ _id: t.data.ex_test_data._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ExchangesTestDataEditExTestDataEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ExchangesTestDataEditExTestDataEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ExchangesTestDataEditExTestDataEditFormErrorMessage");
	},
	"pairs": function() {
		var pairs = this.exTestData_tradePairs.pairs;

		for(i in pairs){
			if(pairs[i].name === this.ex_test_data.tradePair) pairs[i] = mergeObjects(pairs[i], {selected: 'selected'});
			else pairs[i] = mergeObjects(pairs[i], {selected: ''});
		}
		return pairs;
	},
	'enError': function() {
		return Meteor.settings.public.ExTestDataErrorConfig;
	}
	
});
