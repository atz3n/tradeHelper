var pageSession = new ReactiveDict();

Template.ExchangesEditKraken.rendered = function() {
	
};

Template.ExchangesEditKraken.events({
	
});

Template.ExchangesEditKraken.helpers({
	
});

Template.ExchangesEditKrakenEditForm.rendered = function() {
	

	pageSession.set("exchangesEditKrakenEditFormInfoMessage", "");
	pageSession.set("exchangesEditKrakenEditFormErrorMessage", "");

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

Template.ExchangesEditKrakenEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exchangesEditKrakenEditFormInfoMessage", "");
		pageSession.set("exchangesEditKrakenEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var exchangesEditKrakenEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(exchangesEditKrakenEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exchangesEditKrakenEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("exchangesEditKrakenEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Krakens.update({ _id: t.data.kraken._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ExchangesEditKrakenEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("exchangesEditKrakenEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("exchangesEditKrakenEditFormErrorMessage");
	}
	
});
