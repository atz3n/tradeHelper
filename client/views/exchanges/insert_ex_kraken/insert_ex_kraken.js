var pageSession = new ReactiveDict();

Template.ExchangesInsertExKraken.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.ExchangesInsertExKraken.events({
	
});

Template.ExchangesInsertExKraken.helpers({
	
});

Template.ExchangesInsertExKrakenInsertForm.rendered = function() {
	
	pageSession.set('disableOwBaConfig', false);
	pageSession.set('disableAvConfig', false);
	pageSession.set('disableHotModeConfig', true);
	pageSession.set("exchangesInsertExKrakenInsertFormInfoMessage", "");
	pageSession.set("exchangesInsertExKrakenInsertFormErrorMessage", "");

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

Template.ExchangesInsertExKrakenInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exchangesInsertExKrakenInsertFormInfoMessage", "");
		pageSession.set("exchangesInsertExKrakenInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var exchangesInsertExKrakenInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(exchangesInsertExKrakenInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exchangesInsertExKrakenInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("exchangesInsertExKrakenInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = ExKrakens.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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
	},
	'click input': function(e) {

		if ($(e.target).prop("name") == "priceType") {
			if($(e.target).prop("value") !== 'tradesAverage'){
				pageSession.set('disableAvConfig', true);
			} else {
				pageSession.set('disableAvConfig', false);
			}
		}

		if ($(e.target).prop("name") == "hotMode") {
			if($(e.target).context.checked) {
				pageSession.set('disableHotModeConfig', false);
			} else {
				pageSession.set('disableHotModeConfig', true);
			}
		}

		if ($(e.target).prop("name") == "balanceType") {
			if($(e.target).prop("value") === 'krakenBalance'){
				pageSession.set('disableOwBaConfig', true);
			} else {
				pageSession.set('disableOwBaConfig', false);
			}
		}
	}
	
});

Template.ExchangesInsertExKrakenInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("exchangesInsertExKrakenInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("exchangesInsertExKrakenInsertFormErrorMessage");
	},
	'pairs': function() {
		return this.exKraken_tradePairs.pairs;
	},
	'disableAvConfig': function() {
		return pageSession.get('disableAvConfig');
	},
	'disableHotModeConfig': function() {
		return pageSession.get('disableHotModeConfig');
	},
	'disableOwBaConfig': function() {
		return pageSession.get('disableOwBaConfig');
	}
	
});
