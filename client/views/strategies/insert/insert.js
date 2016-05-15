var pageSession = new ReactiveDict();

Template.StrategiesInsert.rendered = function() {
	
};

Template.StrategiesInsert.events({
	
});

Template.StrategiesInsert.helpers({
	
});

Template.StrategiesInsertInsertForm.rendered = function() {
	pageSession.set("pluginBundlesCrudItems", []);


	pageSession.set("strategiesInsertInsertFormInfoMessage", "");
	pageSession.set("strategiesInsertInsertFormErrorMessage", "");

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

Template.StrategiesInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("strategiesInsertInsertFormInfoMessage", "");
		pageSession.set("strategiesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var strategiesInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(strategiesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("strategiesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("strategies", {strategyId: newId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("strategiesInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				values.pluginBundles = pageSession.get("pluginBundlesCrudItems"); newId = Strategies.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.StrategiesInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("strategiesInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("strategiesInsertInsertFormErrorMessage");
	}, 
	"pluginBundlesCrudItems": function() {
		return pageSession.get("pluginBundlesCrudItems");
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


Template.StrategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertForm.rendered = function() {
	

	pageSession.set("strategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormInfoMessage", "");
	pageSession.set("strategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormErrorMessage", "");

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

Template.StrategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("strategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormInfoMessage", "");
		pageSession.set("strategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var strategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(strategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("strategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("strategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormErrorMessage", message);
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

Template.StrategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("strategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("strategiesInsertFieldPluginBundlesInsertFormContainerFieldPluginBundlesInsertFormErrorMessage");
	},
	"pluginBundles": function() {
		return getPluginBundles();
	}
	
});
