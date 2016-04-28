var pageSession = new ReactiveDict();

Template.PluginbundlesEdit.rendered = function() {
	
};

Template.PluginbundlesEdit.events({
	
});

Template.PluginbundlesEdit.helpers({
	
});

Template.PluginbundlesEditEditForm.rendered = function() {
	pageSession.set("bundlePluginsCrudItems", this.data.pluginbundle.bundlePlugins || []);


	pageSession.set("pluginbundlesEditEditFormInfoMessage", "");
	pageSession.set("pluginbundlesEditEditFormErrorMessage", "");

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

Template.PluginbundlesEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginbundlesEditEditFormInfoMessage", "");
		pageSession.set("pluginbundlesEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginbundlesEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(pluginbundlesEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginbundlesEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("pluginbundles", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginbundlesEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				values.bundlePlugins = pageSession.get("bundlePluginsCrudItems"); PluginBundles.update({ _id: t.data.pluginbundle._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("pluginbundles", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}, 

	'click .field-bundle-plugins .crud-table-row .delete-icon': function(e, t) { e.preventDefault(); var self = this; bootbox.dialog({ message: 'Delete? Are you sure?', title: 'Delete', animate: false, buttons: { success: { label: 'Yes', className: 'btn-success', callback: function() { var items = pageSession.get('bundlePluginsCrudItems'); var index = -1; _.find(items, function(item, i) { if(item._id == self._id) { index = i; return true; }; }); if(index >= 0) items.splice(index, 1); pageSession.set('bundlePluginsCrudItems', items); } }, danger: { label: 'No', className: 'btn-default' } } }); return false; }
});

Template.PluginbundlesEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginbundlesEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginbundlesEditEditFormErrorMessage");
	}, 
		"bundlePluginsCrudItems": function() {
		return pageSession.get("bundlePluginsCrudItems");
	}
});


Template.PluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertForm.rendered = function() {
	

	pageSession.set("pluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormInfoMessage", "");
	pageSession.set("pluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormErrorMessage", "");

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

Template.PluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormInfoMessage", "");
		pageSession.set("pluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				var data = pageSession.get("bundlePluginsCrudItems") || []; values._id = Random.id(); data.push(values); pageSession.set("bundlePluginsCrudItems", data); $("#field-bundle-plugins-insert-form").modal("hide"); e.currentTarget.reset();
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		$("#field-bundle-plugins-insert-form").modal("hide"); t.find("form").reset();

		/*CANCEL_REDIRECT*/
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

Template.PluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginbundlesEditFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormErrorMessage");
	}
	
});
