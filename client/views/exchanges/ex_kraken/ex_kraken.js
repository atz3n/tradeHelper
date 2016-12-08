var pageSession = new ReactiveDict();

Template.ExchangesExKraken.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.ExchangesExKraken.events({
	
});

Template.ExchangesExKraken.helpers({
	
});

var ExchangesExKrakenViewExKrakenItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ExchangesExKrakenViewExKrakenSearchString");
	var sortBy = pageSession.get("ExchangesExKrakenViewExKrakenSortBy");
	var sortAscending = pageSession.get("ExchangesExKrakenViewExKrakenSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "pair"];
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

var ExchangesExKrakenViewExKrakenExport = function(cursor, fileType) {
	var data = ExchangesExKrakenViewExKrakenItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ExchangesExKrakenViewExKraken.rendered = function() {
	pageSession.set("ExchangesExKrakenViewExKrakenStyle", "table");
	
};

Template.ExchangesExKrakenViewExKraken.events({
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
				pageSession.set("ExchangesExKrakenViewExKrakenSearchString", searchString);
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
					pageSession.set("ExchangesExKrakenViewExKrakenSearchString", searchString);
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
					pageSession.set("ExchangesExKrakenViewExKrakenSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("exchanges.ex_kraken.insert_ex_kraken", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ExchangesExKrakenViewExKrakenExport(this.ex_krakens, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ExchangesExKrakenViewExKrakenExport(this.ex_krakens, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ExchangesExKrakenViewExKrakenExport(this.ex_krakens, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ExchangesExKrakenViewExKrakenExport(this.ex_krakens, "json");
	}

	
});

Template.ExchangesExKrakenViewExKraken.helpers({

	"insertButtonClass": function() {
		return ExKrakens.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.ex_krakens || this.ex_krakens.count() == 0;
	},
	"isNotEmpty": function() {
		return this.ex_krakens && this.ex_krakens.count() > 0;
	},
	"isNotFound": function() {
		return this.ex_krakens && pageSession.get("ExchangesExKrakenViewExKrakenSearchString") && ExchangesExKrakenViewExKrakenItems(this.ex_krakens).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ExchangesExKrakenViewExKrakenSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ExchangesExKrakenViewExKrakenStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ExchangesExKrakenViewExKrakenStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ExchangesExKrakenViewExKrakenStyle") == "gallery";
	}

	
});


Template.ExchangesExKrakenViewExKrakenTable.rendered = function() {
	
};

Template.ExchangesExKrakenViewExKrakenTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ExchangesExKrakenViewExKrakenSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ExchangesExKrakenViewExKrakenSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ExchangesExKrakenViewExKrakenSortAscending") || false;
			pageSession.set("ExchangesExKrakenViewExKrakenSortAscending", !sortAscending);
		} else {
			pageSession.set("ExchangesExKrakenViewExKrakenSortAscending", true);
		}
	}
});

Template.ExchangesExKrakenViewExKrakenTable.helpers({
	"tableItems": function() {
		return ExchangesExKrakenViewExKrakenItems(this.ex_krakens);
	}
});


Template.ExchangesExKrakenViewExKrakenTableItems.rendered = function() {
	
};

Template.ExchangesExKrakenViewExKrakenTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("exchanges.ex_kraken.details_ex_kraken", {exKrakenId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		ExKrakens.update({ _id: this._id }, { $set: values });

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
						ExKrakens.remove({ _id: me._id });
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
		Router.go("exchanges.ex_kraken.edit_ex_kraken", {exKrakenId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.ExchangesExKrakenViewExKrakenTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return ExKrakens.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return ExKrakens.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});