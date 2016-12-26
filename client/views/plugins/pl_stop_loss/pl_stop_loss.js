var pageSession = new ReactiveDict();

Template.PluginsPlStopLoss.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlStopLoss.events({
	
});

Template.PluginsPlStopLoss.helpers({
	
});



var PluginsPlStopLossViewPlStopLossesItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlStopLossViewPlStopLossesSearchString");
	var sortBy = pageSession.get("PluginsPlStopLossViewPlStopLossesSortBy");
	var sortAscending = pageSession.get("PluginsPlStopLossViewPlStopLossesSortAscending");
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

var PluginsPlStopLossViewPlStopLossesExport = function(cursor, fileType) {
	var data = PluginsPlStopLossViewPlStopLossesItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlStopLossViewPlStopLosses.rendered = function() {
	pageSession.set("PluginsPlStopLossViewPlStopLossesStyle", "table");
	
};

Template.PluginsPlStopLossViewPlStopLosses.events({
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
				pageSession.set("PluginsPlStopLossViewPlStopLossesSearchString", searchString);
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
					pageSession.set("PluginsPlStopLossViewPlStopLossesSearchString", searchString);
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
					pageSession.set("PluginsPlStopLossViewPlStopLossesSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_stop_loss.insert_pl_stop_loss", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlStopLossViewPlStopLossesExport(this.pl_stop_losses, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlStopLossViewPlStopLossesExport(this.pl_stop_losses, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlStopLossViewPlStopLossesExport(this.pl_stop_losses, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlStopLossViewPlStopLossesExport(this.pl_stop_losses, "json");
	}

	
});

Template.PluginsPlStopLossViewPlStopLosses.helpers({

	"insertButtonClass": function() {
		return PlStopLosses.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_stop_losses || this.pl_stop_losses.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_stop_losses && this.pl_stop_losses.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_stop_losses && pageSession.get("PluginsPlStopLossViewPlStopLossesSearchString") && PluginsPlStopLossViewPlStopLossesItems(this.pl_stop_losses).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlStopLossViewPlStopLossesSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlStopLossViewPlStopLossesStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlStopLossViewPlStopLossesStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlStopLossViewPlStopLossesStyle") == "gallery";
	}

	
});


Template.PluginsPlStopLossViewPlStopLossesTable.rendered = function() {
	
};

Template.PluginsPlStopLossViewPlStopLossesTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlStopLossViewPlStopLossesSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlStopLossViewPlStopLossesSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlStopLossViewPlStopLossesSortAscending") || false;
			pageSession.set("PluginsPlStopLossViewPlStopLossesSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlStopLossViewPlStopLossesSortAscending", true);
		}
	}
});

Template.PluginsPlStopLossViewPlStopLossesTable.helpers({
	"tableItems": function() {
		return PluginsPlStopLossViewPlStopLossesItems(this.pl_stop_losses);
	}
});


Template.PluginsPlStopLossViewPlStopLossesTableItems.rendered = function() {
	
};

Template.PluginsPlStopLossViewPlStopLossesTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_stop_loss.details_pl_stop_loss", {plStopLossId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlStopLosses.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #duplicate-button": function(e, t) {
		e.preventDefault();

		var tmp = this;
		delete tmp._id;

		PlStopLosses.insert(tmp);
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
						PlStopLosses.remove({ _id: me._id });
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
		Router.go("plugins.pl_stop_loss.edit_pl_stop_loss", {plStopLossId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlStopLossViewPlStopLossesTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlStopLosses.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlStopLosses.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});
