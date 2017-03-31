var pageSession = new ReactiveDict();

Template.PluginsPlSafetyLineOut.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlSafetyLineOut.events({
	
});

Template.PluginsPlSafetyLineOut.helpers({
	
});

var PluginsPlSafetyLineOutViewPlSafetyLineOutsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlSafetyLineOutViewPlSafetyLineOutsSearchString");
	var sortBy = pageSession.get("PluginsPlSafetyLineOutViewPlSafetyLineOutsSortBy");
	var sortAscending = pageSession.get("PluginsPlSafetyLineOutViewPlSafetyLineOutsSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	for (i in raw) raw[i].exchangeName = getExchangeName(raw[i].exchange);

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "exchange", "safetyLineBase", "safetyLineType", "safetyLineStepWidth", "enLong", "enShort"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var PluginsPlSafetyLineOutViewPlSafetyLineOutsExport = function(cursor, fileType) {
	var data = PluginsPlSafetyLineOutViewPlSafetyLineOutsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlSafetyLineOutViewPlSafetyLineOuts.rendered = function() {
	pageSession.set("PluginsPlSafetyLineOutViewPlSafetyLineOutsStyle", "table");
	
};

Template.PluginsPlSafetyLineOutViewPlSafetyLineOuts.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("PluginsPlSafetyLineOutViewPlSafetyLineOutsSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("PluginsPlSafetyLineOutViewPlSafetyLineOutsSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("PluginsPlSafetyLineOutViewPlSafetyLineOutsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_safety_line_out.insert_pl_safety_line_out", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlSafetyLineOutViewPlSafetyLineOutsExport(this.pl_safety_line_outs, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlSafetyLineOutViewPlSafetyLineOutsExport(this.pl_safety_line_outs, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlSafetyLineOutViewPlSafetyLineOutsExport(this.pl_safety_line_outs, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlSafetyLineOutViewPlSafetyLineOutsExport(this.pl_safety_line_outs, "json");
	}

	
});

Template.PluginsPlSafetyLineOutViewPlSafetyLineOuts.helpers({

	"insertButtonClass": function() {
		return PlSafetyLineOuts.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_safety_line_outs || this.pl_safety_line_outs.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_safety_line_outs && this.pl_safety_line_outs.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_safety_line_outs && pageSession.get("PluginsPlSafetyLineOutViewPlSafetyLineOutsSearchString") && PluginsPlSafetyLineOutViewPlSafetyLineOutsItems(this.pl_safety_line_outs).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlSafetyLineOutViewPlSafetyLineOutsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlSafetyLineOutViewPlSafetyLineOutsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlSafetyLineOutViewPlSafetyLineOutsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlSafetyLineOutViewPlSafetyLineOutsStyle") == "gallery";
	}

	
});


Template.PluginsPlSafetyLineOutViewPlSafetyLineOutsTable.rendered = function() {
	
};

Template.PluginsPlSafetyLineOutViewPlSafetyLineOutsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlSafetyLineOutViewPlSafetyLineOutsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlSafetyLineOutViewPlSafetyLineOutsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlSafetyLineOutViewPlSafetyLineOutsSortAscending") || false;
			pageSession.set("PluginsPlSafetyLineOutViewPlSafetyLineOutsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlSafetyLineOutViewPlSafetyLineOutsSortAscending", true);
		}
	}
});

Template.PluginsPlSafetyLineOutViewPlSafetyLineOutsTable.helpers({
	"tableItems": function() {
		return PluginsPlSafetyLineOutViewPlSafetyLineOutsItems(this.pl_safety_line_outs);
	}
});


Template.PluginsPlSafetyLineOutViewPlSafetyLineOutsTableItems.rendered = function() {
	
};

Template.PluginsPlSafetyLineOutViewPlSafetyLineOutsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_safety_line_out.details_pl_safety_line_out", {plSafetyLineOutId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlSafetyLineOuts.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #duplicate-button": function(e, t) {
		e.preventDefault();

		var tmp = this;
		delete tmp._id;

		PlSafetyLineOuts.insert(tmp);
		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						PlSafetyLineOuts.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_safety_line_out.edit_pl_safety_line_out", {plSafetyLineOutId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlSafetyLineOutViewPlSafetyLineOutsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlSafetyLineOuts.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlSafetyLineOuts.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});
