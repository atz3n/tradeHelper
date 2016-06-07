var pageSession = new ReactiveDict();

Template.StrategiesEdit.rendered = function() {
	Session.set('activePage', 'strategies');
};

Template.StrategiesEdit.events({
	
});

Template.StrategiesEdit.helpers({
	
});

Template.StrategiesEditEditForm.rendered = function() {
	pageSession.set("pluginBundlesCrudItems", this.data.strategy.pluginBundles || []);


	pageSession.set("strategiesEditEditFormInfoMessage", "");
	pageSession.set("strategiesEditEditFormErrorMessage", "");

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

Template.StrategiesEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("strategiesEditEditFormInfoMessage", "");
		pageSession.set("strategiesEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var strategiesEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(strategiesEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("strategiesEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("strategies", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("strategiesEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				values.pluginBundles = pageSession.get("pluginBundlesCrudItems"); Strategies.update({ _id: t.data.strategy._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("strategies", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}, 

	'click .field-plugin-bundles .crud-table-row .delete-icon': function(e, t) { e.preventDefault(); var self = this; bootbox.dialog({ message: 'Delete? Are you sure?', title: 'Delete', animate: false, buttons: { success: { label: 'Yes', className: 'btn-success', callback: function() { var items = pageSession.get('pluginBundlesCrudItems'); var index = -1; _.find(items, function(item, i) { if(item._id == self._id) { index = i; return true; }; }); if(index >= 0) items.splice(index, 1); pageSession.set('pluginBundlesCrudItems', items); } }, danger: { label: 'No', className: 'btn-default' } } }); return false; }
});

Template.StrategiesEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("strategiesEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("strategiesEditEditFormErrorMessage");
	}, 
		"pluginBundlesCrudItems": function() {
		if(pageSession.get("pluginBundlesCrudItems")){
			if(pageSession.get("pluginBundlesCrudItems").length > 0){
				var ret = pageSession.get("pluginBundlesCrudItems");
				
				for(var i = 0 ; i < ret.length ; i++){
					ret[i].bundle = getPluginBundleName(ret[i].bundle);
				}

				return ret;
			}
		}
			
		return pageSession.get("pluginBundlesCrudItems");
	}
});


Template.StrategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertForm.rendered = function() {
	

	pageSession.set("strategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormInfoMessage", "");
	pageSession.set("strategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormErrorMessage", "");

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

Template.StrategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("strategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormInfoMessage", "");
		pageSession.set("strategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var strategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(strategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("strategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("strategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				var data = pageSession.get("pluginBundlesCrudItems") || []; values._id = Random.id(); data.push(values); pageSession.set("pluginBundlesCrudItems", data); $("#field-plugin-bundles-insert-form").modal("hide"); e.currentTarget.reset();
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		$("#field-plugin-bundles-insert-form").modal("hide"); t.find("form").reset();

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

Template.StrategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("strategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("strategiesEditFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormErrorMessage");
	},
	"pluginBundles": function() {
		return getPluginBundles();
	}
	
});
