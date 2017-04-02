var pageSession = new ReactiveDict();

Template.PluginsPlTrailingStopIn.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlTrailingStopIn.events({
	
});

Template.PluginsPlTrailingStopIn.helpers({
	
});


var PluginsPlTrailingStopInViewPlTrailingStopInsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlTrailingStopInViewPlTrailingStopInsSearchString");
	var sortBy = pageSession.get("PluginsPlTrailingStopInViewPlTrailingStopInsSortBy");
	var sortAscending = pageSession.get("PluginsPlTrailingStopInViewPlTrailingStopInsSortAscending");
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

var PluginsPlTrailingStopInViewPlTrailingStopInsExport = function(cursor, fileType) {
	var data = PluginsPlTrailingStopInViewPlTrailingStopInsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlTrailingStopInViewPlTrailingStopIns.rendered = function() {
	pageSession.set("PluginsPlTrailingStopInViewPlTrailingStopInsStyle", "table");
	
};

Template.PluginsPlTrailingStopInViewPlTrailingStopIns.events({
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
				pageSession.set("PluginsPlTrailingStopInViewPlTrailingStopInsSearchString", searchString);
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
					pageSession.set("PluginsPlTrailingStopInViewPlTrailingStopInsSearchString", searchString);
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
					pageSession.set("PluginsPlTrailingStopInViewPlTrailingStopInsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_trailing_stop_in.insert_pl_trailing_stop_in", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlTrailingStopInViewPlTrailingStopInsExport(this.pl_trailing_stop_ins, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlTrailingStopInViewPlTrailingStopInsExport(this.pl_trailing_stop_ins, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlTrailingStopInViewPlTrailingStopInsExport(this.pl_trailing_stop_ins, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlTrailingStopInViewPlTrailingStopInsExport(this.pl_trailing_stop_ins, "json");
	}

	
});

Template.PluginsPlTrailingStopInViewPlTrailingStopIns.helpers({

	"insertButtonClass": function() {
		return PlTrailingStopIns.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_trailing_stop_ins || this.pl_trailing_stop_ins.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_trailing_stop_ins && this.pl_trailing_stop_ins.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_trailing_stop_ins && pageSession.get("PluginsPlTrailingStopInViewPlTrailingStopInsSearchString") && PluginsPlTrailingStopInViewPlTrailingStopInsItems(this.pl_trailing_stop_ins).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlTrailingStopInViewPlTrailingStopInsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlTrailingStopInViewPlTrailingStopInsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlTrailingStopInViewPlTrailingStopInsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlTrailingStopInViewPlTrailingStopInsStyle") == "gallery";
	}

	
});


Template.PluginsPlTrailingStopInViewPlTrailingStopInsTable.rendered = function() {
	
};

Template.PluginsPlTrailingStopInViewPlTrailingStopInsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlTrailingStopInViewPlTrailingStopInsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlTrailingStopInViewPlTrailingStopInsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlTrailingStopInViewPlTrailingStopInsSortAscending") || false;
			pageSession.set("PluginsPlTrailingStopInViewPlTrailingStopInsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlTrailingStopInViewPlTrailingStopInsSortAscending", true);
		}
	}
});

Template.PluginsPlTrailingStopInViewPlTrailingStopInsTable.helpers({
	"tableItems": function() {
		return PluginsPlTrailingStopInViewPlTrailingStopInsItems(this.pl_trailing_stop_ins);
	}
});


Template.PluginsPlTrailingStopInViewPlTrailingStopInsTableItems.rendered = function() {
	
};

Template.PluginsPlTrailingStopInViewPlTrailingStopInsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_trailing_stop_in.details_pl_trailing_stop_in", {plTrailingStopInId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlTrailingStopIns.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #duplicate-button": function(e, t) {
		e.preventDefault();

		var tmp = this;
		delete tmp._id;

		PlTrailingStopIns.insert(tmp);
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
						PlTrailingStopIns.remove({ _id: me._id });
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
		Router.go("plugins.pl_trailing_stop_in.edit_pl_trailing_stop_in", {plTrailingStopInId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlTrailingStopInViewPlTrailingStopInsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlTrailingStopIns.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlTrailingStopIns.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});
