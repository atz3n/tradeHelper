var pageSession = new ReactiveDict();

Template.ExchangesEditExTestData.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.ExchangesEditExTestData.events({
	
});

Template.ExchangesEditExTestData.helpers({
	
});

Template.ExchangesEditExTestDataEditForm.rendered = function() {
	

	pageSession.set("exchangesEditExTestDataEditFormInfoMessage", "");
	pageSession.set("exchangesEditExTestDataEditFormErrorMessage", "");

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

Template.ExchangesEditExTestDataEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exchangesEditExTestDataEditFormInfoMessage", "");
		pageSession.set("exchangesEditExTestDataEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var exchangesEditExTestDataEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(exchangesEditExTestDataEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exchangesEditExTestDataEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("exchangesEditExTestDataEditFormErrorMessage", message);
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

Template.ExchangesEditExTestDataEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("exchangesEditExTestDataEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("exchangesEditExTestDataEditFormErrorMessage");
	},
	"pairs": function() {
		var pairs = this.exTestData_tradePairs.pairs;

		for(i in pairs){
			if(pairs[i].name === this.ex_test_data.tradePair) pairs[i] = mergeObjects(pairs[i], {selected: 'selected'});
			else pairs[i] = mergeObjects(pairs[i], {selected: ''});
		}
		return this.exTestData_tradePairs.pairs;
	}
	
});
