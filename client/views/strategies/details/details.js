var pageSession = new ReactiveDict();

Template.StrategiesDetails.rendered = function() {
	
};

Template.StrategiesDetails.events({
	
});

Template.StrategiesDetails.helpers({
	
});

Template.StrategiesDetailsDetailsForm.rendered = function() {
	pageSession.set("orPluginsCrudItems", this.data.strategy.orPlugins || []);


	pageSession.set("strategiesDetailsDetailsFormInfoMessage", "");
	pageSession.set("strategiesDetailsDetailsFormErrorMessage", "");

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

Template.StrategiesDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("strategiesDetailsDetailsFormInfoMessage", "");
		pageSession.set("strategiesDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var strategiesDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(strategiesDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("strategiesDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("strategiesDetailsDetailsFormErrorMessage", message);
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

		Router.go("strategies", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("strategies", {});
	}

	
});

Template.StrategiesDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("strategiesDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("strategiesDetailsDetailsFormErrorMessage");
	}, 
		"orPluginsCrudItems": function() {
		return pageSession.get("orPluginsCrudItems");
	}
});
