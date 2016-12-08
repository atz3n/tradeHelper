var pageSession = new ReactiveDict();

Template.ExchangesExTestDataEditExTestData.rendered = function() {

};

Template.ExchangesExTestDataEditExTestData.events({
	
});

Template.ExchangesExTestDataEditExTestData.helpers({
	
});

Template.ExchangesExTestDataEditExTestDataEditForm.rendered = function() {
	

	pageSession.set("ExchangesExTestDataEditExTestDataEditFormInfoMessage", "");
	pageSession.set("ExchangesExTestDataEditExTestDataEditFormErrorMessage", "");

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

Template.ExchangesExTestDataEditExTestDataEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ExchangesExTestDataEditExTestDataEditFormInfoMessage", "");
		pageSession.set("ExchangesExTestDataEditExTestDataEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ExchangesExTestDataEditExTestDataEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(ExchangesExTestDataEditExTestDataEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ExchangesExTestDataEditExTestDataEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges.ex_test_data", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ExchangesExTestDataEditExTestDataEditFormErrorMessage", message);
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

Template.ExchangesExTestDataEditExTestDataEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ExchangesExTestDataEditExTestDataEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ExchangesExTestDataEditExTestDataEditFormErrorMessage");
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
