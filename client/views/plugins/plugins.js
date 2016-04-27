var pageSession = new ReactiveDict();

Template.Plugins.rendered = function() {
	
};

Template.Plugins.events({
	
});

Template.Plugins.helpers({
	
});

var PluginsViewSwingsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewSwingsSearchString");
	var sortBy = pageSession.get("PluginsViewSwingsSortBy");
	var sortAscending = pageSession.get("PluginsViewSwingsSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "platform", "lnpnp", "latsnp", "snpnp", "sabbnp", "enLong", "enShort"];
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

var PluginsViewSwingsExport = function(cursor, fileType) {
	var data = PluginsViewSwingsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsViewSwings.rendered = function() {
	pageSession.set("PluginsViewSwingsStyle", "table");
	
};

Template.PluginsViewSwings.events({
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
				pageSession.set("PluginsViewSwingsSearchString", searchString);
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
					pageSession.set("PluginsViewSwingsSearchString", searchString);
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
					pageSession.set("PluginsViewSwingsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.insert_swing", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsViewSwingsExport(this.swings, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsViewSwingsExport(this.swings, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsViewSwingsExport(this.swings, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsViewSwingsExport(this.swings, "json");
	}

	
});

Template.PluginsViewSwings.helpers({

	"insertButtonClass": function() {
		return Swings.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.swings || this.swings.count() == 0;
	},
	"isNotEmpty": function() {
		return this.swings && this.swings.count() > 0;
	},
	"isNotFound": function() {
		return this.swings && pageSession.get("PluginsViewSwingsSearchString") && PluginsViewSwingsItems(this.swings).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsViewSwingsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsViewSwingsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsViewSwingsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsViewSwingsStyle") == "gallery";
	}

	
});


Template.PluginsViewSwingsTable.rendered = function() {
	
};

Template.PluginsViewSwingsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsViewSwingsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsViewSwingsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsViewSwingsSortAscending") || false;
			pageSession.set("PluginsViewSwingsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsViewSwingsSortAscending", true);
		}
	}
});

Template.PluginsViewSwingsTable.helpers({
	"tableItems": function() {
		return PluginsViewSwingsItems(this.swings);
	}
});


Template.PluginsViewSwingsTableItems.rendered = function() {
	
};

Template.PluginsViewSwingsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.details_swing", {swingId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Swings.update({ _id: this._id }, { $set: values });

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
						Swings.remove({ _id: me._id });
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
		Router.go("plugins.edit_swing", {swingId: this._id});
		return false;
	}
});

Template.PluginsViewSwingsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Swings.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Swings.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

var PluginsViewDummysItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewDummysSearchString");
	var sortBy = pageSession.get("PluginsViewDummysSortBy");
	var sortAscending = pageSession.get("PluginsViewDummysSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "type", "dummyCont"];
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

var PluginsViewDummysExport = function(cursor, fileType) {
	var data = PluginsViewDummysItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsViewDummys.rendered = function() {
	pageSession.set("PluginsViewDummysStyle", "table");
	
};

Template.PluginsViewDummys.events({
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
				pageSession.set("PluginsViewDummysSearchString", searchString);
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
					pageSession.set("PluginsViewDummysSearchString", searchString);
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
					pageSession.set("PluginsViewDummysSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.insert_dummy", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsViewDummysExport(this.dummys, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsViewDummysExport(this.dummys, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsViewDummysExport(this.dummys, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsViewDummysExport(this.dummys, "json");
	}

	
});

Template.PluginsViewDummys.helpers({

	"insertButtonClass": function() {
		return Dummys.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.dummys || this.dummys.count() == 0;
	},
	"isNotEmpty": function() {
		return this.dummys && this.dummys.count() > 0;
	},
	"isNotFound": function() {
		return this.dummys && pageSession.get("PluginsViewDummysSearchString") && PluginsViewDummysItems(this.dummys).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsViewDummysSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsViewDummysStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsViewDummysStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsViewDummysStyle") == "gallery";
	}

	
});


Template.PluginsViewDummysTable.rendered = function() {
	
};

Template.PluginsViewDummysTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsViewDummysSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsViewDummysSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsViewDummysSortAscending") || false;
			pageSession.set("PluginsViewDummysSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsViewDummysSortAscending", true);
		}
	}
});

Template.PluginsViewDummysTable.helpers({
	"tableItems": function() {
		return PluginsViewDummysItems(this.dummys);
	}
});


Template.PluginsViewDummysTableItems.rendered = function() {
	
};

Template.PluginsViewDummysTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.details_dummy", {dummyId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Dummys.update({ _id: this._id }, { $set: values });

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
						Dummys.remove({ _id: me._id });
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
		Router.go("plugins.edit_dummy", {dummyId: this._id});
		return false;
	}
});

Template.PluginsViewDummysTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Dummys.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Dummys.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
