var pageSession = new ReactiveDict();

Template.PluginsPlDummy.rendered = function() {

};

Template.PluginsPlDummy.events({
	
});

Template.PluginsPlDummy.helpers({
	
});

var PluginsPlDummyViewPlDummyItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlDummyViewPlDummySearchString");
	var sortBy = pageSession.get("PluginsPlDummyViewPlDummySortBy");
	var sortAscending = pageSession.get("PluginsPlDummyViewPlDummySortAscending");
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
		var searchFields = ["name", "exchange"];
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

var PluginsPlDummyViewPlDummyExport = function(cursor, fileType) {
	var data = PluginsPlDummyViewPlDummyItems(cursor);
	var exportFields = [];

	var str = exportArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlDummyViewPlDummy.rendered = function() {
	pageSession.set("PluginsPlDummyViewPlDummyStyle", "table");
	
};

Template.PluginsPlDummyViewPlDummy.events({
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
				pageSession.set("PluginsPlDummyViewPlDummySearchString", searchString);
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
					pageSession.set("PluginsPlDummyViewPlDummySearchString", searchString);
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
					pageSession.set("PluginsPlDummyViewPlDummySearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_dummy.insert_pl_dummy", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlDummyViewPlDummyExport(this.pl_dummies, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlDummyViewPlDummyExport(this.pl_dummies, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlDummyViewPlDummyExport(this.pl_dummies, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlDummyViewPlDummyExport(this.pl_dummies, "json");
	}

	
});

Template.PluginsPlDummyViewPlDummy.helpers({

	"insertButtonClass": function() {
		return PlDummies.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_dummies || this.pl_dummies.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_dummies && this.pl_dummies.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_dummies && pageSession.get("PluginsPlDummyViewPlDummySearchString") && PluginsPlDummyViewPlDummyItems(this.pl_dummies).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlDummyViewPlDummySearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlDummyViewPlDummyStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlDummyViewPlDummyStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlDummyViewPlDummyStyle") == "gallery";
	}

	
});


Template.PluginsPlDummyViewPlDummyTable.rendered = function() {
	
};

Template.PluginsPlDummyViewPlDummyTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlDummyViewPlDummySortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlDummyViewPlDummySortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlDummyViewPlDummySortAscending") || false;
			pageSession.set("PluginsPlDummyViewPlDummySortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlDummyViewPlDummySortAscending", true);
		}
	}
});

Template.PluginsPlDummyViewPlDummyTable.helpers({
	"tableItems": function() {
		return PluginsPlDummyViewPlDummyItems(this.pl_dummies);
	}
});


Template.PluginsPlDummyViewPlDummyTableItems.rendered = function() {
	
};

Template.PluginsPlDummyViewPlDummyTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_dummy.details_pl_dummy", {plDummyId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Meteor.call("plDummiesUpdate", this._id, values, function(err, res) {
			if(err) {
				alert(err.message);
			}
		});

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
						PlDummies.remove({ _id: me._id });
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
		Router.go("plugins.pl_dummy.edit_pl_dummy", {plDummyId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlDummyViewPlDummyTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlDummies.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlDummies.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});
