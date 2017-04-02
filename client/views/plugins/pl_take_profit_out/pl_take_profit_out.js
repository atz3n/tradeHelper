var pageSession = new ReactiveDict();

Template.PluginsPlTakeProfitOut.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlTakeProfitOut.events({
	
});

Template.PluginsPlTakeProfitOut.helpers({
	
});



var PluginsPlTakeProfitOutViewPlTakeProfitOutsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlTakeProfitOutViewPlTakeProfitOutsSearchString");
	var sortBy = pageSession.get("PluginsPlTakeProfitOutViewPlTakeProfitOutsSortBy");
	var sortAscending = pageSession.get("PluginsPlTakeProfitOutViewPlTakeProfitOutsSortAscending");
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
		var searchFields = ["name", "exchange", "takeValueType", "takeValueAmount", "enLong", "enShort"];
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

var PluginsPlTakeProfitOutViewPlTakeProfitOutsExport = function(cursor, fileType) {
	var data = PluginsPlTakeProfitOutViewPlTakeProfitOutsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlTakeProfitOutViewPlTakeProfitOuts.rendered = function() {
	pageSession.set("PluginsPlTakeProfitOutViewPlTakeProfitOutsStyle", "table");
	
};

Template.PluginsPlTakeProfitOutViewPlTakeProfitOuts.events({
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
				pageSession.set("PluginsPlTakeProfitOutViewPlTakeProfitOutsSearchString", searchString);
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
					pageSession.set("PluginsPlTakeProfitOutViewPlTakeProfitOutsSearchString", searchString);
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
					pageSession.set("PluginsPlTakeProfitOutViewPlTakeProfitOutsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_take_profit_out.insert_pl_take_profit_out", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlTakeProfitOutViewPlTakeProfitOutsExport(this.pl_take_profit_outs, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlTakeProfitOutViewPlTakeProfitOutsExport(this.pl_take_profit_outs, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlTakeProfitOutViewPlTakeProfitOutsExport(this.pl_take_profit_outs, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlTakeProfitOutViewPlTakeProfitOutsExport(this.pl_take_profit_outs, "json");
	}

	
});

Template.PluginsPlTakeProfitOutViewPlTakeProfitOuts.helpers({

	"insertButtonClass": function() {
		return PlTakeProfitOuts.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_take_profit_outs || this.pl_take_profit_outs.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_take_profit_outs && this.pl_take_profit_outs.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_take_profit_outs && pageSession.get("PluginsPlTakeProfitOutViewPlTakeProfitOutsSearchString") && PluginsPlTakeProfitOutViewPlTakeProfitOutsItems(this.pl_take_profit_outs).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlTakeProfitOutViewPlTakeProfitOutsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlTakeProfitOutViewPlTakeProfitOutsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlTakeProfitOutViewPlTakeProfitOutsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlTakeProfitOutViewPlTakeProfitOutsStyle") == "gallery";
	}

	
});


Template.PluginsPlTakeProfitOutViewPlTakeProfitOutsTable.rendered = function() {
	
};

Template.PluginsPlTakeProfitOutViewPlTakeProfitOutsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlTakeProfitOutViewPlTakeProfitOutsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlTakeProfitOutViewPlTakeProfitOutsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlTakeProfitOutViewPlTakeProfitOutsSortAscending") || false;
			pageSession.set("PluginsPlTakeProfitOutViewPlTakeProfitOutsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlTakeProfitOutViewPlTakeProfitOutsSortAscending", true);
		}
	}
});

Template.PluginsPlTakeProfitOutViewPlTakeProfitOutsTable.helpers({
	"tableItems": function() {
		return PluginsPlTakeProfitOutViewPlTakeProfitOutsItems(this.pl_take_profit_outs);
	}
});


Template.PluginsPlTakeProfitOutViewPlTakeProfitOutsTableItems.rendered = function() {
	
};

Template.PluginsPlTakeProfitOutViewPlTakeProfitOutsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_take_profit_out.details_pl_take_profit_out", {plTakeProfitOutId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlTakeProfitOuts.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #duplicate-button": function(e, t) {
		e.preventDefault();

		var tmp = this;
		delete tmp._id;

		PlTakeProfitOuts.insert(tmp);
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
						PlTakeProfitOuts.remove({ _id: me._id });
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
		Router.go("plugins.pl_take_profit_out.edit_pl_take_profit_out", {plTakeProfitOutId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlTakeProfitOutViewPlTakeProfitOutsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlTakeProfitOuts.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlTakeProfitOuts.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});

var PluginsViewPlTrailingStopInsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewPlTrailingStopInsSearchString");
	var sortBy = pageSession.get("PluginsViewPlTrailingStopInsSortBy");
	var sortAscending = pageSession.get("PluginsViewPlTrailingStopInsSortAscending");
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
		var searchFields = ["name", "exchange", "enLong", "enShort"];
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
