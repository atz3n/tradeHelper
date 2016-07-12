var pageSession = new ReactiveDict();

Template.ExchangesEditExKraken.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.ExchangesEditExKraken.events({
	
});

Template.ExchangesEditExKraken.helpers({
	
});

Template.ExchangesEditExKrakenEditForm.rendered = function() {
	var tmp = this.data.ex_kraken

	pageSession.set('disableOwBaConfig', false);
	pageSession.set('disableAvConfig', false);
	pageSession.set('disableHotModeConfig', true);

	if(tmp.priceType !== 'tradesAverage') pageSession.set('disableAvConfig', true);
	if(tmp.balanceType === 'krakenBalance') pageSession.set('disableOwBaConfig', true);
	if(tmp.hotMode) pageSession.set('disableHotModeConfig', false);

	pageSession.set("exchangesEditExKrakenEditFormInfoMessage", "");
	pageSession.set("exchangesEditExKrakenEditFormErrorMessage", "");

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

Template.ExchangesEditExKrakenEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("exchangesEditExKrakenEditFormInfoMessage", "");
		pageSession.set("exchangesEditExKrakenEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var exchangesEditExKrakenEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(exchangesEditExKrakenEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("exchangesEditExKrakenEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("exchangesEditExKrakenEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				ExKrakens.update({ _id: t.data.ex_kraken._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ExchangesEditExKrakenEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("exchangesEditExKrakenEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("exchangesEditExKrakenEditFormErrorMessage");
	},
	"pairs": function() {
		var pairs = this.exKraken_tradePairs.pairs;

		for(i in pairs){
			if(pairs[i].name === this.ex_kraken.pair) pairs[i] = mergeObjects(pairs[i], {selected: 'selected'});
			else pairs[i] = mergeObjects(pairs[i], {selected: ''});
		}
		return pairs;
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
