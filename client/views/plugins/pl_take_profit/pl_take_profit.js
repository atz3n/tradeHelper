var pageSession = new ReactiveDict();

Template.PluginsPlTakeProfit.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlTakeProfit.events({
	
});

Template.PluginsPlTakeProfit.helpers({
	
});



var PluginsPlTakeProfitViewPlTakeProfitsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlTakeProfitViewPlTakeProfitsSearchString");
	var sortBy = pageSession.get("PluginsPlTakeProfitViewPlTakeProfitsSortBy");
	var sortAscending = pageSession.get("PluginsPlTakeProfitViewPlTakeProfitsSortAscending");
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

var PluginsPlTakeProfitViewPlTakeProfitsExport = function(cursor, fileType) {
	var data = PluginsPlTakeProfitViewPlTakeProfitsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlTakeProfitViewPlTakeProfits.rendered = function() {
	pageSession.set("PluginsPlTakeProfitViewPlTakeProfitsStyle", "table");
	
};

Template.PluginsPlTakeProfitViewPlTakeProfits.events({
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
				pageSession.set("PluginsPlTakeProfitViewPlTakeProfitsSearchString", searchString);
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
					pageSession.set("PluginsPlTakeProfitViewPlTakeProfitsSearchString", searchString);
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
					pageSession.set("PluginsPlTakeProfitViewPlTakeProfitsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_take_profit.insert_pl_take_profit", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlTakeProfitViewPlTakeProfitsExport(this.pl_take_profits, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlTakeProfitViewPlTakeProfitsExport(this.pl_take_profits, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlTakeProfitViewPlTakeProfitsExport(this.pl_take_profits, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlTakeProfitViewPlTakeProfitsExport(this.pl_take_profits, "json");
	}

	
});

Template.PluginsPlTakeProfitViewPlTakeProfits.helpers({

	"insertButtonClass": function() {
		return PlTakeProfits.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_take_profits || this.pl_take_profits.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_take_profits && this.pl_take_profits.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_take_profits && pageSession.get("PluginsPlTakeProfitViewPlTakeProfitsSearchString") && PluginsPlTakeProfitViewPlTakeProfitsItems(this.pl_take_profits).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlTakeProfitViewPlTakeProfitsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlTakeProfitViewPlTakeProfitsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlTakeProfitViewPlTakeProfitsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlTakeProfitViewPlTakeProfitsStyle") == "gallery";
	}

	
});


Template.PluginsPlTakeProfitViewPlTakeProfitsTable.rendered = function() {
	
};

Template.PluginsPlTakeProfitViewPlTakeProfitsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlTakeProfitViewPlTakeProfitsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlTakeProfitViewPlTakeProfitsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlTakeProfitViewPlTakeProfitsSortAscending") || false;
			pageSession.set("PluginsPlTakeProfitViewPlTakeProfitsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlTakeProfitViewPlTakeProfitsSortAscending", true);
		}
	}
});

Template.PluginsPlTakeProfitViewPlTakeProfitsTable.helpers({
	"tableItems": function() {
		return PluginsPlTakeProfitViewPlTakeProfitsItems(this.pl_take_profits);
	}
});


Template.PluginsPlTakeProfitViewPlTakeProfitsTableItems.rendered = function() {
	
};

Template.PluginsPlTakeProfitViewPlTakeProfitsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_take_profit.details_pl_take_profit", {plTakeProfitId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlTakeProfits.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #duplicate-button": function(e, t) {
		e.preventDefault();

		var tmp = this;
		delete tmp._id;

		PlTakeProfits.insert(tmp);
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
						PlTakeProfits.remove({ _id: me._id });
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
		Router.go("plugins.pl_take_profit.edit_pl_take_profit", {plTakeProfitId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlTakeProfitViewPlTakeProfitsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlTakeProfits.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlTakeProfits.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});

var PluginsViewPlThresholdInsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewPlThresholdInsSearchString");
	var sortBy = pageSession.get("PluginsViewPlThresholdInsSortBy");
	var sortAscending = pageSession.get("PluginsViewPlThresholdInsSortAscending");
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
		var searchFields = ["name", "exchange", "thresholdType", "thresholdAmount", "enLong", "enShort"];
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
