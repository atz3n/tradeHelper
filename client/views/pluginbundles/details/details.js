var pageSession = new ReactiveDict();

Template.PluginbundlesDetails.rendered = function() {
	
};

Template.PluginbundlesDetails.events({
	
});

Template.PluginbundlesDetails.helpers({
	
});

Template.PluginbundlesDetailsDetailsForm.rendered = function() {
	pageSession.set("bundlePluginsCrudItems", this.data.pluginbundle.bundlePlugins || []);


	pageSession.set("pluginbundlesDetailsDetailsFormInfoMessage", "");
	pageSession.set("pluginbundlesDetailsDetailsFormErrorMessage", "");

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

Template.PluginbundlesDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginbundlesDetailsDetailsFormInfoMessage", "");
		pageSession.set("pluginbundlesDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginbundlesDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(pluginbundlesDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginbundlesDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginbundlesDetailsDetailsFormErrorMessage", message);
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

		Router.go("pluginbundles", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("pluginbundles", {});
	}

	
});

Template.PluginbundlesDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginbundlesDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginbundlesDetailsDetailsFormErrorMessage");
	}, 
		"bundlePluginsCrudItems": function() {
		return pageSession.get("bundlePluginsCrudItems");
	}
});
