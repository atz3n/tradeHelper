var pageSession = new ReactiveDict();

Template.Strategies.rendered = function() {
	Session.set('activePage', 'strategies');
};

Template.Strategies.events({
	
});

Template.Strategies.helpers({
	
});

var StrategiesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("StrategiesViewSearchString");
	var sortBy = pageSession.get("StrategiesViewSortBy");
	var sortAscending = pageSession.get("StrategiesViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

  	for (var i = 0; i < raw.length; i++) {

  		var pluginsCnt = 0;
		var bundlesCnt = 0;

	    for (var j = 0; j < raw[i].pluginBundles.length; j++) {
	    	var bundles = raw[i].pluginBundles[j];
	    	bundlesCnt++;

	    	for(var k = 0 ; k < bundles.pluginIds.length ; k++){
	    		pluginsCnt++;
	    	}
	    }
	      raw[i].pluginsBundlesString = pluginsCnt + ' / ' + bundlesCnt;
	}

	/* sort by name */
    raw = raw.sort(function(a, b) {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    });

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "updateTime", "timeUnit", "mode", "pluginBundles"];
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

var StrategiesViewExport = function(cursor, fileType) {
	var data = StrategiesViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.StrategiesView.rendered = function() {
	pageSession.set("StrategiesViewStyle", "table");
	
};

Template.StrategiesView.events({
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
				pageSession.set("StrategiesViewSearchString", searchString);
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
					pageSession.set("StrategiesViewSearchString", searchString);
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
					pageSession.set("StrategiesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("strategies.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		StrategiesViewExport(this.strategies, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		StrategiesViewExport(this.strategies, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		StrategiesViewExport(this.strategies, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		StrategiesViewExport(this.strategies, "json");
	}

	
});

Template.StrategiesView.helpers({

	"insertButtonClass": function() {
		return Strategies.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.strategies || this.strategies.count() == 0;
	},
	"isNotEmpty": function() {
		return this.strategies && this.strategies.count() > 0;
	},
	"isNotFound": function() {
		return this.strategies && pageSession.get("StrategiesViewSearchString") && StrategiesViewItems(this.strategies).length == 0;
	},
	"searchString": function() {
		return pageSession.get("StrategiesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("StrategiesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("StrategiesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("StrategiesViewStyle") == "gallery";
	}

	
});


Template.StrategiesViewTable.rendered = function() {
	
};

Template.StrategiesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("StrategiesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("StrategiesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("StrategiesViewSortAscending") || false;
			pageSession.set("StrategiesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("StrategiesViewSortAscending", true);
		}
	}
});

Template.StrategiesViewTable.helpers({
	"tableItems": function() {
		return StrategiesViewItems(this.strategies);
	}
});


Template.StrategiesViewTableItems.rendered = function() {
	
};

Template.StrategiesViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("strategies.details", {strategyId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Strategies.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #duplicate-button": function(e, t) {
		e.preventDefault();

		var tmp = this;
		delete tmp._id;

		Strategies.insert(tmp);
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
						Strategies.remove({ _id: me._id });
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
		Router.go("strategies.edit", {strategyId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.StrategiesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Strategies.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Strategies.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.active) return "warning";
		else return "default";
	}
});
