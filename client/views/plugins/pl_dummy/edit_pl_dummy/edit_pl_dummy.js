var pageSession = new ReactiveDict();

Template.PluginsPlDummyEditPlDummy.rendered = function() {

};

Template.PluginsPlDummyEditPlDummy.events({
	
});

Template.PluginsPlDummyEditPlDummy.helpers({
	
});

Template.PluginsPlDummyEditPlDummyEditForm.rendered = function() {
	

	pageSession.set("pluginsPlDummyEditPlDummyEditFormInfoMessage", "");
	pageSession.set("pluginsPlDummyEditPlDummyEditFormErrorMessage", "");

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

Template.PluginsPlDummyEditPlDummyEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginsPlDummyEditPlDummyEditFormInfoMessage", "");
		pageSession.set("pluginsPlDummyEditPlDummyEditFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var pluginsPlDummyEditPlDummyEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(pluginsPlDummyEditPlDummyEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginsPlDummyEditPlDummyEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("plugins.pl_dummy", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginsPlDummyEditPlDummyEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				PlDummies.update({ _id: t.data.pl_dummy._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("plugins.pl_dummy", {});
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

Template.PluginsPlDummyEditPlDummyEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginsPlDummyEditPlDummyEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginsPlDummyEditPlDummyEditFormErrorMessage");
	},
	"exchanges": function() {
		return getExchanges();
	}
	
});
