var pageSession = new ReactiveDict();

Template.PluginsPlTrailingStopOut.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlTrailingStopOut.events({
	
});

Template.PluginsPlTrailingStopOut.helpers({
	
});


var PluginsPlTrailingStopOutViewPlTrailingStopOutsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlTrailingStopOutViewPlTrailingStopOutsSearchString");
	var sortBy = pageSession.get("PluginsPlTrailingStopOutViewPlTrailingStopOutsSortBy");
	var sortAscending = pageSession.get("PluginsPlTrailingStopOutViewPlTrailingStopOutsSortAscending");
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
		var searchFields = ["name", "exchange", "thresholdBase", "thresholdType", "thresholdValue", "thresholdExceedings", "enLong", "enShort"];
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

var PluginsPlTrailingStopOutViewPlTrailingStopOutsExport = function(cursor, fileType) {
	var data = PluginsPlTrailingStopOutViewPlTrailingStopOutsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlTrailingStopOutViewPlTrailingStopOuts.rendered = function() {
	pageSession.set("PluginsPlTrailingStopOutViewPlTrailingStopOutsStyle", "table");
	
};

Template.PluginsPlTrailingStopOutViewPlTrailingStopOuts.events({
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
				pageSession.set("PluginsPlTrailingStopOutViewPlTrailingStopOutsSearchString", searchString);
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
					pageSession.set("PluginsPlTrailingStopOutViewPlTrailingStopOutsSearchString", searchString);
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
					pageSession.set("PluginsPlTrailingStopOutViewPlTrailingStopOutsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_trailing_stop_out.insert_pl_trailing_stop_out", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlTrailingStopOutViewPlTrailingStopOutsExport(this.pl_trailing_stop_outs, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlTrailingStopOutViewPlTrailingStopOutsExport(this.pl_trailing_stop_outs, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlTrailingStopOutViewPlTrailingStopOutsExport(this.pl_trailing_stop_outs, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlTrailingStopOutViewPlTrailingStopOutsExport(this.pl_trailing_stop_outs, "json");
	}

	
});

Template.PluginsPlTrailingStopOutViewPlTrailingStopOuts.helpers({

	"insertButtonClass": function() {
		return PlTrailingStopOuts.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_trailing_stop_outs || this.pl_trailing_stop_outs.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_trailing_stop_outs && this.pl_trailing_stop_outs.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_trailing_stop_outs && pageSession.get("PluginsPlTrailingStopOutViewPlTrailingStopOutsSearchString") && PluginsPlTrailingStopOutViewPlTrailingStopOutsItems(this.pl_trailing_stop_outs).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlTrailingStopOutViewPlTrailingStopOutsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlTrailingStopOutViewPlTrailingStopOutsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlTrailingStopOutViewPlTrailingStopOutsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlTrailingStopOutViewPlTrailingStopOutsStyle") == "gallery";
	}

	
});


Template.PluginsPlTrailingStopOutViewPlTrailingStopOutsTable.rendered = function() {
	
};

Template.PluginsPlTrailingStopOutViewPlTrailingStopOutsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlTrailingStopOutViewPlTrailingStopOutsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlTrailingStopOutViewPlTrailingStopOutsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlTrailingStopOutViewPlTrailingStopOutsSortAscending") || false;
			pageSession.set("PluginsPlTrailingStopOutViewPlTrailingStopOutsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlTrailingStopOutViewPlTrailingStopOutsSortAscending", true);
		}
	}
});

Template.PluginsPlTrailingStopOutViewPlTrailingStopOutsTable.helpers({
	"tableItems": function() {
		return PluginsPlTrailingStopOutViewPlTrailingStopOutsItems(this.pl_trailing_stop_outs);
	}
});


Template.PluginsPlTrailingStopOutViewPlTrailingStopOutsTableItems.rendered = function() {
	
};

Template.PluginsPlTrailingStopOutViewPlTrailingStopOutsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_trailing_stop_out.details_pl_trailing_stop_out", {plTrailingStopOutId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlTrailingStopOuts.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #duplicate-button": function(e, t) {
		e.preventDefault();

		var tmp = this;
		delete tmp._id;

		PlTrailingStopOuts.insert(tmp);
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
						PlTrailingStopOuts.remove({ _id: me._id });
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
		Router.go("plugins.pl_trailing_stop_out.edit_pl_trailing_stop_out", {plTrailingStopOutId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlTrailingStopOutViewPlTrailingStopOutsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlTrailingStopOuts.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlTrailingStopOuts.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});
