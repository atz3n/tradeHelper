var pageSession = new ReactiveDict();

Template.Develop.rendered = function() {
	Session.set('activePage', 'develop');
};

Template.Develop.events({
	
});

Template.Develop.helpers({
	
});

var DevelopViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("DevelopViewSearchString");
	var sortBy = pageSession.get("DevelopViewSortBy");
	var sortAscending = pageSession.get("DevelopViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["enNotification", "dummy"];
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

var DevelopViewExport = function(cursor, fileType) {
	var data = DevelopViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.DevelopView.rendered = function() {
	pageSession.set("DevelopViewStyle", "table");
	
};

Template.DevelopView.events({
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
				pageSession.set("DevelopViewSearchString", searchString);
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
					pageSession.set("DevelopViewSearchString", searchString);
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
					pageSession.set("DevelopViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		/**/
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		DevelopViewExport(this.settings, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		DevelopViewExport(this.settings, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		DevelopViewExport(this.settings, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		DevelopViewExport(this.settings, "json");
	}

	
});

Template.DevelopView.helpers({

	"insertButtonClass": function() {
		return Settings.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.settings || this.settings.count() == 0;
	},
	"isNotEmpty": function() {
		return this.settings && this.settings.count() > 0;
	},
	"isNotFound": function() {
		return this.settings && pageSession.get("DevelopViewSearchString") && DevelopViewItems(this.settings).length == 0;
	},
	"searchString": function() {
		return pageSession.get("DevelopViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("DevelopViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("DevelopViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("DevelopViewStyle") == "gallery";
	}

	
});


Template.DevelopViewTable.rendered = function() {
	
};

Template.DevelopViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("DevelopViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("DevelopViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("DevelopViewSortAscending") || false;
			pageSession.set("DevelopViewSortAscending", !sortAscending);
		} else {
			pageSession.set("DevelopViewSortAscending", true);
		}
	}
});

Template.DevelopViewTable.helpers({
	"tableItems": function() {
		return DevelopViewItems(this.settings);
	}
});


Template.DevelopViewTableItems.rendered = function() {
	
};

Template.DevelopViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("develop.details_settings", {settingId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Settings.update({ _id: this._id }, { $set: values });

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
						Settings.remove({ _id: me._id });
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
		Router.go("develop.edit_settings", {settingId: this._id});
		return false;
	}
});

Template.DevelopViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Settings.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Settings.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
