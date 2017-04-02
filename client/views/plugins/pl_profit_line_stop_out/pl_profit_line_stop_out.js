var pageSession = new ReactiveDict();

Template.PluginsPlProfitLineStopOut.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlProfitLineStopOut.events({
	
});

Template.PluginsPlProfitLineStopOut.helpers({
	
});

var PluginsPlProfitLineStopOutViewPlProfitLineStopOutsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSearchString");
	var sortBy = pageSession.get("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSortBy");
	var sortAscending = pageSession.get("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSortAscending");
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
		var searchFields = ["name", "exchange", "profitLineBase", "profitLineType", "profitLineStepWidth", "enLong", "enShort"];
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

var PluginsPlProfitLineStopOutViewPlProfitLineStopOutsExport = function(cursor, fileType) {
	var data = PluginsPlProfitLineStopOutViewPlProfitLineStopOutsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlProfitLineStopOutViewPlProfitLineStopOuts.rendered = function() {
	pageSession.set("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsStyle", "table");
	
};

Template.PluginsPlProfitLineStopOutViewPlProfitLineStopOuts.events({
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
				pageSession.set("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSearchString", searchString);
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
					pageSession.set("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSearchString", searchString);
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
					pageSession.set("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_profit_line_stop_out_out.insert_pl_profit_line_stop_out_out", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlProfitLineStopOutViewPlProfitLineStopOutsExport(this.pl_profit_line_stop_out_outs, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlProfitLineStopOutViewPlProfitLineStopOutsExport(this.pl_profit_line_stop_out_outs, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlProfitLineStopOutViewPlProfitLineStopOutsExport(this.pl_profit_line_stop_out_outs, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlProfitLineStopOutViewPlProfitLineStopOutsExport(this.pl_profit_line_stop_out_outs, "json");
	}

	
});

Template.PluginsPlProfitLineStopOutViewPlProfitLineStopOuts.helpers({

	"insertButtonClass": function() {
		return PlProfitLineStopOuts.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_profit_line_stop_out_outs || this.pl_profit_line_stop_out_outs.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_profit_line_stop_out_outs && this.pl_profit_line_stop_out_outs.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_profit_line_stop_out_outs && pageSession.get("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSearchString") && PluginsPlProfitLineStopOutViewPlProfitLineStopOutsItems(this.pl_profit_line_stop_out_outs).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsStyle") == "gallery";
	}

	
});


Template.PluginsPlProfitLineStopOutViewPlProfitLineStopOutsTable.rendered = function() {
	
};

Template.PluginsPlProfitLineStopOutViewPlProfitLineStopOutsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSortAscending") || false;
			pageSession.set("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlProfitLineStopOutViewPlProfitLineStopOutsSortAscending", true);
		}
	}
});

Template.PluginsPlProfitLineStopOutViewPlProfitLineStopOutsTable.helpers({
	"tableItems": function() {
		return PluginsPlProfitLineStopOutViewPlProfitLineStopOutsItems(this.pl_profit_line_stop_out_outs);
	}
});


Template.PluginsPlProfitLineStopOutViewPlProfitLineStopOutsTableItems.rendered = function() {
	
};

Template.PluginsPlProfitLineStopOutViewPlProfitLineStopOutsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_profit_line_stop_out_out.details_pl_profit_line_stop_out_out", {plProfitLineStopOutId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlProfitLineStopOuts.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #duplicate-button": function(e, t) {
		e.preventDefault();

		var tmp = this;
		delete tmp._id;

		PlProfitLineStopOuts.insert(tmp);
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
						PlProfitLineStopOuts.remove({ _id: me._id });
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
		Router.go("plugins.pl_profit_line_stop_out_out.edit_pl_profit_line_stop_out_out", {plProfitLineStopOutId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlProfitLineStopOutViewPlProfitLineStopOutsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlProfitLineStopOuts.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlProfitLineStopOuts.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});
