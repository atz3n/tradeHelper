var pageSession = new ReactiveDict();

Template.Plugins.rendered = function() {
	
};

Template.Plugins.events({
	
});

Template.Plugins.helpers({
	
});

var PluginsViewPlSwingsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewPlSwingsSearchString");
	var sortBy = pageSession.get("PluginsViewPlSwingsSortBy");
	var sortAscending = pageSession.get("PluginsViewPlSwingsSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "lnpnp", "latsnp", "snpnp", "sabbnp", "enLong", "enShort"];
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

var PluginsViewPlSwingsExport = function(cursor, fileType) {
	var data = PluginsViewPlSwingsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsViewPlSwings.rendered = function() {
	pageSession.set("PluginsViewPlSwingsStyle", "table");
	
};

Template.PluginsViewPlSwings.events({
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
				pageSession.set("PluginsViewPlSwingsSearchString", searchString);
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
					pageSession.set("PluginsViewPlSwingsSearchString", searchString);
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
					pageSession.set("PluginsViewPlSwingsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.insert_pl_swing", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsViewPlSwingsExport(this.pl_swings, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsViewPlSwingsExport(this.pl_swings, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsViewPlSwingsExport(this.pl_swings, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsViewPlSwingsExport(this.pl_swings, "json");
	}

	
});

Template.PluginsViewPlSwings.helpers({

	"insertButtonClass": function() {
		return PlSwings.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_swings || this.pl_swings.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_swings && this.pl_swings.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_swings && pageSession.get("PluginsViewPlSwingsSearchString") && PluginsViewPlSwingsItems(this.pl_swings).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsViewPlSwingsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsViewPlSwingsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsViewPlSwingsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsViewPlSwingsStyle") == "gallery";
	}

	
});


Template.PluginsViewPlSwingsTable.rendered = function() {
	
};

Template.PluginsViewPlSwingsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsViewPlSwingsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsViewPlSwingsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsViewPlSwingsSortAscending") || false;
			pageSession.set("PluginsViewPlSwingsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsViewPlSwingsSortAscending", true);
		}
	}
});

Template.PluginsViewPlSwingsTable.helpers({
	"tableItems": function() {
		return PluginsViewPlSwingsItems(this.pl_swings);
	}
});


Template.PluginsViewPlSwingsTableItems.rendered = function() {
	
};

Template.PluginsViewPlSwingsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.details_pl_swing", {plSwingId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlSwings.update({ _id: this._id }, { $set: values });

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
						PlSwings.remove({ _id: me._id });
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
		Router.go("plugins.edit_pl_swing", {plSwingId: this._id});
		return false;
	}
});

Template.PluginsViewPlSwingsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlSwings.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlSwings.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

var PluginsViewPlDummysItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewPlDummysSearchString");
	var sortBy = pageSession.get("PluginsViewPlDummysSortBy");
	var sortAscending = pageSession.get("PluginsViewPlDummysSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "dummyCont"];
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

var PluginsViewPlDummysExport = function(cursor, fileType) {
	var data = PluginsViewPlDummysItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsViewPlDummys.rendered = function() {
	pageSession.set("PluginsViewPlDummysStyle", "table");
	
};

Template.PluginsViewPlDummys.events({
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
				pageSession.set("PluginsViewPlDummysSearchString", searchString);
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
					pageSession.set("PluginsViewPlDummysSearchString", searchString);
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
					pageSession.set("PluginsViewPlDummysSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.insert_pl_dummy", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsViewPlDummysExport(this.pl_dummys, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsViewPlDummysExport(this.pl_dummys, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsViewPlDummysExport(this.pl_dummys, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsViewPlDummysExport(this.pl_dummys, "json");
	}

	
});

Template.PluginsViewPlDummys.helpers({

	"insertButtonClass": function() {
		return PlDummys.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_dummys || this.pl_dummys.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_dummys && this.pl_dummys.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_dummys && pageSession.get("PluginsViewPlDummysSearchString") && PluginsViewPlDummysItems(this.pl_dummys).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsViewPlDummysSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsViewPlDummysStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsViewPlDummysStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsViewPlDummysStyle") == "gallery";
	}

	
});


Template.PluginsViewPlDummysTable.rendered = function() {
	
};

Template.PluginsViewPlDummysTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsViewPlDummysSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsViewPlDummysSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsViewPlDummysSortAscending") || false;
			pageSession.set("PluginsViewPlDummysSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsViewPlDummysSortAscending", true);
		}
	}
});

Template.PluginsViewPlDummysTable.helpers({
	"tableItems": function() {
		return PluginsViewPlDummysItems(this.pl_dummys);
	}
});


Template.PluginsViewPlDummysTableItems.rendered = function() {
	
};

Template.PluginsViewPlDummysTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.details_pl_dummy", {plDummyId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlDummys.update({ _id: this._id }, { $set: values });

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
						PlDummys.remove({ _id: me._id });
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
		Router.go("plugins.edit_pl_dummy", {plDummyId: this._id});
		return false;
	}
});

Template.PluginsViewPlDummysTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlDummys.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlDummys.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
