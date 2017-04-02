var pageSession = new ReactiveDict();

Template.PluginsPlStopLossOut.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlStopLossOut.events({
	
});

Template.PluginsPlStopLossOut.helpers({
	
});



var PluginsPlStopLossOutViewPlStopLossOutesItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlStopLossOutViewPlStopLossOutesSearchString");
	var sortBy = pageSession.get("PluginsPlStopLossOutViewPlStopLossOutesSortBy");
	var sortAscending = pageSession.get("PluginsPlStopLossOutViewPlStopLossOutesSortAscending");
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

var PluginsPlStopLossOutViewPlStopLossOutesExport = function(cursor, fileType) {
	var data = PluginsPlStopLossOutViewPlStopLossOutesItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlStopLossOutViewPlStopLossOutes.rendered = function() {
	pageSession.set("PluginsPlStopLossOutViewPlStopLossOutesStyle", "table");
	
};

Template.PluginsPlStopLossOutViewPlStopLossOutes.events({
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
				pageSession.set("PluginsPlStopLossOutViewPlStopLossOutesSearchString", searchString);
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
					pageSession.set("PluginsPlStopLossOutViewPlStopLossOutesSearchString", searchString);
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
					pageSession.set("PluginsPlStopLossOutViewPlStopLossOutesSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_stop_loss_out.insert_pl_stop_loss_out", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlStopLossOutViewPlStopLossOutesExport(this.pl_stop_loss_outes, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlStopLossOutViewPlStopLossOutesExport(this.pl_stop_loss_outes, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlStopLossOutViewPlStopLossOutesExport(this.pl_stop_loss_outes, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlStopLossOutViewPlStopLossOutesExport(this.pl_stop_loss_outes, "json");
	}

	
});

Template.PluginsPlStopLossOutViewPlStopLossOutes.helpers({

	"insertButtonClass": function() {
		return PlStopLossOutes.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_stop_loss_outes || this.pl_stop_loss_outes.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_stop_loss_outes && this.pl_stop_loss_outes.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_stop_loss_outes && pageSession.get("PluginsPlStopLossOutViewPlStopLossOutesSearchString") && PluginsPlStopLossOutViewPlStopLossOutesItems(this.pl_stop_loss_outes).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlStopLossOutViewPlStopLossOutesSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlStopLossOutViewPlStopLossOutesStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlStopLossOutViewPlStopLossOutesStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlStopLossOutViewPlStopLossOutesStyle") == "gallery";
	}

	
});


Template.PluginsPlStopLossOutViewPlStopLossOutesTable.rendered = function() {
	
};

Template.PluginsPlStopLossOutViewPlStopLossOutesTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlStopLossOutViewPlStopLossOutesSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlStopLossOutViewPlStopLossOutesSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlStopLossOutViewPlStopLossOutesSortAscending") || false;
			pageSession.set("PluginsPlStopLossOutViewPlStopLossOutesSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlStopLossOutViewPlStopLossOutesSortAscending", true);
		}
	}
});

Template.PluginsPlStopLossOutViewPlStopLossOutesTable.helpers({
	"tableItems": function() {
		return PluginsPlStopLossOutViewPlStopLossOutesItems(this.pl_stop_loss_outes);
	}
});


Template.PluginsPlStopLossOutViewPlStopLossOutesTableItems.rendered = function() {
	
};

Template.PluginsPlStopLossOutViewPlStopLossOutesTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_stop_loss_out.details_pl_stop_loss_out", {plStopLossOutId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlStopLossOutes.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #duplicate-button": function(e, t) {
		e.preventDefault();

		var tmp = this;
		delete tmp._id;

		PlStopLossOutes.insert(tmp);
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
						PlStopLossOutes.remove({ _id: me._id });
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
		Router.go("plugins.pl_stop_loss_out.edit_pl_stop_loss_out", {plStopLossOutId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlStopLossOutViewPlStopLossOutesTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlStopLossOutes.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlStopLossOutes.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});
