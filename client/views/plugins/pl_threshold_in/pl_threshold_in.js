var pageSession = new ReactiveDict();

Template.PluginsPlThresholdIn.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.PluginsPlThresholdIn.events({
	
});

Template.PluginsPlThresholdIn.helpers({
	
});


var PluginsPlThresholdInViewPlThresholdInsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsPlThresholdInViewPlThresholdInsSearchString");
	var sortBy = pageSession.get("PluginsPlThresholdInViewPlThresholdInsSortBy");
	var sortAscending = pageSession.get("PluginsPlThresholdInViewPlThresholdInsSortAscending");
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

var PluginsPlThresholdInViewPlThresholdInsExport = function(cursor, fileType) {
	var data = PluginsPlThresholdInViewPlThresholdInsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsPlThresholdInViewPlThresholdIns.rendered = function() {
	pageSession.set("PluginsPlThresholdInViewPlThresholdInsStyle", "table");
	
};

Template.PluginsPlThresholdInViewPlThresholdIns.events({
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
				pageSession.set("PluginsPlThresholdInViewPlThresholdInsSearchString", searchString);
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
					pageSession.set("PluginsPlThresholdInViewPlThresholdInsSearchString", searchString);
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
					pageSession.set("PluginsPlThresholdInViewPlThresholdInsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.pl_threshold_in.insert_pl_threshold_in", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsPlThresholdInViewPlThresholdInsExport(this.pl_threshold_ins, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsPlThresholdInViewPlThresholdInsExport(this.pl_threshold_ins, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsPlThresholdInViewPlThresholdInsExport(this.pl_threshold_ins, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsPlThresholdInViewPlThresholdInsExport(this.pl_threshold_ins, "json");
	}

	
});

Template.PluginsPlThresholdInViewPlThresholdIns.helpers({

	"insertButtonClass": function() {
		return PlThresholdIns.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_threshold_ins || this.pl_threshold_ins.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_threshold_ins && this.pl_threshold_ins.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_threshold_ins && pageSession.get("PluginsPlThresholdInViewPlThresholdInsSearchString") && PluginsPlThresholdInViewPlThresholdInsItems(this.pl_threshold_ins).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsPlThresholdInViewPlThresholdInsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsPlThresholdInViewPlThresholdInsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsPlThresholdInViewPlThresholdInsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsPlThresholdInViewPlThresholdInsStyle") == "gallery";
	}

	
});


Template.PluginsPlThresholdInViewPlThresholdInsTable.rendered = function() {
	
};

Template.PluginsPlThresholdInViewPlThresholdInsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsPlThresholdInViewPlThresholdInsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsPlThresholdInViewPlThresholdInsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsPlThresholdInViewPlThresholdInsSortAscending") || false;
			pageSession.set("PluginsPlThresholdInViewPlThresholdInsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsPlThresholdInViewPlThresholdInsSortAscending", true);
		}
	}
});

Template.PluginsPlThresholdInViewPlThresholdInsTable.helpers({
	"tableItems": function() {
		return PluginsPlThresholdInViewPlThresholdInsItems(this.pl_threshold_ins);
	}
});


Template.PluginsPlThresholdInViewPlThresholdInsTableItems.rendered = function() {
	
};

Template.PluginsPlThresholdInViewPlThresholdInsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.pl_threshold_in.details_pl_threshold_in", {plThresholdInId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlThresholdIns.update({ _id: this._id }, { $set: values });

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
						PlThresholdIns.remove({ _id: me._id });
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
		Router.go("plugins.pl_threshold_in.edit_pl_threshold_in", {plThresholdInId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsPlThresholdInViewPlThresholdInsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlThresholdIns.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlThresholdIns.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});
