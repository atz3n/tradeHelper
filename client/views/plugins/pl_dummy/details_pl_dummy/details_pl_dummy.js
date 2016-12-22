var pageSession = new ReactiveDict();

Template.PluginsPlDummyDetailsPlDummy.rendered = function() {

};

Template.PluginsPlDummyDetailsPlDummy.events({
	
});

Template.PluginsPlDummyDetailsPlDummy.helpers({
	
});

Template.PluginsPlDummyDetailsPlDummyDetailsForm.rendered = function() {
	

	pageSession.set("pluginsPlDummyDetailsPlDummyDetailsFormInfoMessage", "");
	pageSession.set("pluginsPlDummyDetailsPlDummyDetailsFormErrorMessage", "");

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

Template.PluginsPlDummyDetailsPlDummyDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsPlDummyDetailsPlDummyDetailsFormInfoMessage", "");
		pageSession.set("pluginsPlDummyDetailsPlDummyDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var pluginsPlDummyDetailsPlDummyDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsPlDummyDetailsPlDummyDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsPlDummyDetailsPlDummyDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsPlDummyDetailsPlDummyDetailsFormErrorMessage", message);
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

		Router.go("plugins.pl_dummy", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("plugins.pl_dummy", {});
	}

	
});

Template.PluginsPlDummyDetailsPlDummyDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsPlDummyDetailsPlDummyDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsPlDummyDetailsPlDummyDetailsFormErrorMessage");
	},
	"exchangeName": function() {
		return getExchangeName(this.pl_dummy.exchange);
	}
	
});
