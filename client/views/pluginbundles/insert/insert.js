var pageSession = new ReactiveDict();

Template.PluginbundlesInsert.rendered = function() {
	
};

Template.PluginbundlesInsert.events({
	
});

Template.PluginbundlesInsert.helpers({
	
});

Template.PluginbundlesInsertInsertForm.rendered = function() {
	pageSession.set("bundlePluginsCrudItems", []);


	pageSession.set("pluginbundlesInsertInsertFormInfoMessage", "");
	pageSession.set("pluginbundlesInsertInsertFormErrorMessage", "");

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

Template.PluginbundlesInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginbundlesInsertInsertFormInfoMessage", "");
		pageSession.set("pluginbundlesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginbundlesInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginbundlesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginbundlesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("pluginbundles", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginbundlesInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				values.bundlePlugins = pageSession.get("bundlePluginsCrudItems"); newId = PluginBundles.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.PluginbundlesInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginbundlesInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginbundlesInsertInsertFormErrorMessage");
	}, 
	"bundlePluginsCrudItems": function() {
		if(pageSession.get("bundlePluginsCrudItems")){
			if(pageSession.get("bundlePluginsCrudItems").length > 0){
				var ret = pageSession.get("bundlePluginsCrudItems");
				
				for(var i = 0 ; i < ret.length ; i++){
					ret[i].plugin = getPluginName(ret[i].plugin);
				}

				return ret;
			}
		}
			
	return pageSession.get("bundlePluginsCrudItems");
	}
});


Template.PluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertForm.rendered = function() {
	

	pageSession.set("pluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormInfoMessage", "");
	pageSession.set("pluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormErrorMessage", "");

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

Template.PluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("pluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormInfoMessage", "");
		pageSession.set("pluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var pluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(pluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("pluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("pluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormErrorMessage", message);
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

Template.PluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("pluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("pluginbundlesInsertFieldBundlePluginsInsertFormContainerFieldBundlePluginsInsertFormErrorMessage");
	},
	"plugins": function() {
		return getPlugins();
	}
	
});
