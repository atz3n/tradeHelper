var pageSession = new ReactiveDict();

Template.PluginsPlThresholdOut.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlThresholdOut.events({
	
});

Template.PluginsPlThresholdOut.helpers({
	
});


var PluginsPlThresholdOutViewPlThresholdOutsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlThresholdOutViewPlThresholdOutsSearchString");
	var sortBy = pageSession.get("PluginsPlThresholdOutViewPlThresholdOutsSortBy");
	var sortAscending = pageSession.get("PluginsPlThresholdOutViewPlThresholdOutsSortAscending");
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
		var searchFields = ["name", "exchange", "thresholdBaseBase", "thresholdType", "thresholdAmount", "enLong", "enShort"];
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

var PluginsPlThresholdOutViewPlThresholdOutsExport = function(cursor, fileType) {
	var data = PluginsPlThresholdOutViewPlThresholdOutsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlThresholdOutViewPlThresholdOuts.rendered = function() {
	pageSession.set("PluginsPlThresholdOutViewPlThresholdOutsStyle", "table");
	
};

Template.PluginsPlThresholdOutViewPlThresholdOuts.events({
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
				pageSession.set("PluginsPlThresholdOutViewPlThresholdOutsSearchString", searchString);
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
					pageSession.set("PluginsPlThresholdOutViewPlThresholdOutsSearchString", searchString);
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
					pageSession.set("PluginsPlThresholdOutViewPlThresholdOutsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_threshold_out.insert_pl_threshold_out", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlThresholdOutViewPlThresholdOutsExport(this.pl_threshold_outs, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlThresholdOutViewPlThresholdOutsExport(this.pl_threshold_outs, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlThresholdOutViewPlThresholdOutsExport(this.pl_threshold_outs, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlThresholdOutViewPlThresholdOutsExport(this.pl_threshold_outs, "json");
	}

	
});

Template.PluginsPlThresholdOutViewPlThresholdOuts.helpers({

	"insertButtonClass": function() {
		return PlThresholdOuts.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_threshold_outs || this.pl_threshold_outs.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_threshold_outs && this.pl_threshold_outs.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_threshold_outs && pageSession.get("PluginsPlThresholdOutViewPlThresholdOutsSearchString") && PluginsPlThresholdOutViewPlThresholdOutsItems(this.pl_threshold_outs).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlThresholdOutViewPlThresholdOutsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlThresholdOutViewPlThresholdOutsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlThresholdOutViewPlThresholdOutsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlThresholdOutViewPlThresholdOutsStyle") == "gallery";
	}

	
});


Template.PluginsPlThresholdOutViewPlThresholdOutsTable.rendered = function() {
	
};

Template.PluginsPlThresholdOutViewPlThresholdOutsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlThresholdOutViewPlThresholdOutsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlThresholdOutViewPlThresholdOutsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlThresholdOutViewPlThresholdOutsSortAscending") || false;
			pageSession.set("PluginsPlThresholdOutViewPlThresholdOutsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlThresholdOutViewPlThresholdOutsSortAscending", true);
		}
	}
});

Template.PluginsPlThresholdOutViewPlThresholdOutsTable.helpers({
	"tableItems": function() {
		return PluginsPlThresholdOutViewPlThresholdOutsItems(this.pl_threshold_outs);
	}
});


Template.PluginsPlThresholdOutViewPlThresholdOutsTableItems.rendered = function() {
	
};

Template.PluginsPlThresholdOutViewPlThresholdOutsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_threshold_out.details_pl_threshold_out", {plThresholdOutId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlThresholdOuts.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #duplicate-button": function(e, t) {
		e.preventDefault();

		var tmp = this;
		delete tmp._id;

		PlThresholdOuts.insert(tmp);
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
						PlThresholdOuts.remove({ _id: me._id });
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
		Router.go("plugins.pl_threshold_out.edit_pl_threshold_out", {plThresholdOutId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlThresholdOutViewPlThresholdOutsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlThresholdOuts.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlThresholdOuts.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});
