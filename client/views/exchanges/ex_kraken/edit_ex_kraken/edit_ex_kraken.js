var pageSession = new ReactiveDict();

Template.ExchangesExKrakenEditExKraken.rendered = function() {

};

Template.ExchangesExKrakenEditExKraken.events({
	
});

Template.ExchangesExKrakenEditExKraken.helpers({
	
});

Template.ExchangesExKrakenEditExKrakenEditForm.rendered = function() {
	var tmp = this.data.ex_kraken

	pageSession.set('disableOwBaConfig', false);
	pageSession.set('disableAvConfig', false);
	pageSession.set('disableHotModeConfig', true);

	if(tmp.priceType !== 'tradesAverage') pageSession.set('disableAvConfig', true);
	if(tmp.balanceType === 'krakenBalance') pageSession.set('disableOwBaConfig', true);
	if(tmp.hotMode) pageSession.set('disableHotModeConfig', false);

	pageSession.set("ExchangesExKrakenEditExKrakenEditFormInfoMessage", "");
	pageSession.set("ExchangesExKrakenEditExKrakenEditFormErrorMessage", "");

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

Template.ExchangesExKrakenEditExKrakenEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ExchangesExKrakenEditExKrakenEditFormInfoMessage", "");
		pageSession.set("ExchangesExKrakenEditExKrakenEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ExchangesExKrakenEditExKrakenEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(ExchangesExKrakenEditExKrakenEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ExchangesExKrakenEditExKrakenEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("exchanges.ex_kraken", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ExchangesExKrakenEditExKrakenEditFormErrorMessage", message);
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

		

		Router.go("exchanges.ex_kraken", {});
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

Template.ExchangesExKrakenEditExKrakenEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ExchangesExKrakenEditExKrakenEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ExchangesExKrakenEditExKrakenEditFormErrorMessage");
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

