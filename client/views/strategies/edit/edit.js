var pageSession = new ReactiveDict();

Template.StrategiesEdit.rendered = function() {
	
};

Template.StrategiesEdit.events({
	
});

Template.StrategiesEdit.helpers({
	
});

Template.StrategiesEditEditForm.rendered = function() {
	pageSession.set("orPluginsCrudItems", this.data.strategy.orPlugins || []);


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
				

				values.orPlugins = pageSession.get("orPluginsCrudItems"); Strategies.update({ _id: t.data.strategy._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

	'click .field-or-plugins .crud-table-row .delete-icon': function(e, t) { e.preventDefault(); var self = this; bootbox.dialog({ message: 'Delete? Are you sure?', title: 'Delete', animate: false, buttons: { success: { label: 'Yes', className: 'btn-success', callback: function() { var items = pageSession.get('orPluginsCrudItems'); var index = -1; _.find(items, function(item, i) { if(item._id == self._id) { index = i; return true; }; }); if(index >= 0) items.splice(index, 1); pageSession.set('orPluginsCrudItems', items); } }, danger: { label: 'No', className: 'btn-default' } } }); return false; }
});

Template.StrategiesEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("strategiesEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("strategiesEditEditFormErrorMessage");
	}, 
		"orPluginsCrudItems": function() {
		return pageSession.get("orPluginsCrudItems");
	}
});


Template.StrategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertForm.rendered = function() {
	

	pageSession.set("strategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertFormInfoMessage", "");
	pageSession.set("strategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertFormErrorMessage", "");

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

Template.StrategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("strategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertFormInfoMessage", "");
		pageSession.set("strategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var strategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(strategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("strategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("strategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				var data = pageSession.get("orPluginsCrudItems") || []; values._id = Random.id(); data.push(values); pageSession.set("orPluginsCrudItems", data); $("#field-or-plugins-insert-form").modal("hide"); e.currentTarget.reset();
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		$("#field-or-plugins-insert-form").modal("hide"); t.find("form").reset();

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

Template.StrategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("strategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("strategiesEditFieldOrPluginsInsertFormContainerFieldOrPluginsInsertFormErrorMessage");
	}
	
});
