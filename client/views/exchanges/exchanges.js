var pageSession = new ReactiveDict();

Template.Exchanges.rendered = function() {
	
};

Template.Exchanges.events({
	
});

Template.Exchanges.helpers({
	
});

var ExchangesViewKrakenItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ExchangesViewKrakenSearchString");
	var sortBy = pageSession.get("ExchangesViewKrakenSortBy");
	var sortAscending = pageSession.get("ExchangesViewKrakenSortAscending");
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

var ExchangesViewKrakenExport = function(cursor, fileType) {
	var data = ExchangesViewKrakenItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ExchangesViewKraken.rendered = function() {
	pageSession.set("ExchangesViewKrakenStyle", "table");
	
};

Template.ExchangesViewKraken.events({
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
				pageSession.set("ExchangesViewKrakenSearchString", searchString);
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
					pageSession.set("ExchangesViewKrakenSearchString", searchString);
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
					pageSession.set("ExchangesViewKrakenSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("exchanges.insert_kraken", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ExchangesViewKrakenExport(this.krakens, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ExchangesViewKrakenExport(this.krakens, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ExchangesViewKrakenExport(this.krakens, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ExchangesViewKrakenExport(this.krakens, "json");
	}

	
});

Template.ExchangesViewKraken.helpers({

	"insertButtonClass": function() {
		return Krakens.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.krakens || this.krakens.count() == 0;
	},
	"isNotEmpty": function() {
		return this.krakens && this.krakens.count() > 0;
	},
	"isNotFound": function() {
		return this.krakens && pageSession.get("ExchangesViewKrakenSearchString") && ExchangesViewKrakenItems(this.krakens).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ExchangesViewKrakenSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ExchangesViewKrakenStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ExchangesViewKrakenStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ExchangesViewKrakenStyle") == "gallery";
	}

	
});


Template.ExchangesViewKrakenTable.rendered = function() {
	
};

Template.ExchangesViewKrakenTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ExchangesViewKrakenSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ExchangesViewKrakenSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ExchangesViewKrakenSortAscending") || false;
			pageSession.set("ExchangesViewKrakenSortAscending", !sortAscending);
		} else {
			pageSession.set("ExchangesViewKrakenSortAscending", true);
		}
	}
});

Template.ExchangesViewKrakenTable.helpers({
	"tableItems": function() {
		return ExchangesViewKrakenItems(this.krakens);
	}
});


Template.ExchangesViewKrakenTableItems.rendered = function() {
	
};

Template.ExchangesViewKrakenTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("exchanges.details_kraken", {krakenId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Krakens.update({ _id: this._id }, { $set: values });

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
						Krakens.remove({ _id: me._id });
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
		Router.go("exchanges.edit_kraken", {krakenId: this._id});
		return false;
	}
});

Template.ExchangesViewKrakenTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Krakens.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Krakens.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

var ExchangesViewTestDataItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ExchangesViewTestDataSearchString");
	var sortBy = pageSession.get("ExchangesViewTestDataSortBy");
	var sortAscending = pageSession.get("ExchangesViewTestDataSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "data"];
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

var ExchangesViewTestDataExport = function(cursor, fileType) {
	var data = ExchangesViewTestDataItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ExchangesViewTestData.rendered = function() {
	pageSession.set("ExchangesViewTestDataStyle", "table");
	
};

Template.ExchangesViewTestData.events({
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
				pageSession.set("ExchangesViewTestDataSearchString", searchString);
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
					pageSession.set("ExchangesViewTestDataSearchString", searchString);
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
					pageSession.set("ExchangesViewTestDataSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("exchanges.insert_test_data", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ExchangesViewTestDataExport(this.test_datas, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ExchangesViewTestDataExport(this.test_datas, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ExchangesViewTestDataExport(this.test_datas, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ExchangesViewTestDataExport(this.test_datas, "json");
	}

	
});

Template.ExchangesViewTestData.helpers({

	"insertButtonClass": function() {
		return TestDatas.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.test_datas || this.test_datas.count() == 0;
	},
	"isNotEmpty": function() {
		return this.test_datas && this.test_datas.count() > 0;
	},
	"isNotFound": function() {
		return this.test_datas && pageSession.get("ExchangesViewTestDataSearchString") && ExchangesViewTestDataItems(this.test_datas).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ExchangesViewTestDataSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ExchangesViewTestDataStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ExchangesViewTestDataStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ExchangesViewTestDataStyle") == "gallery";
	}

	
});


Template.ExchangesViewTestDataTable.rendered = function() {
	
};

Template.ExchangesViewTestDataTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ExchangesViewTestDataSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ExchangesViewTestDataSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ExchangesViewTestDataSortAscending") || false;
			pageSession.set("ExchangesViewTestDataSortAscending", !sortAscending);
		} else {
			pageSession.set("ExchangesViewTestDataSortAscending", true);
		}
	}
});

Template.ExchangesViewTestDataTable.helpers({
	"tableItems": function() {
		return ExchangesViewTestDataItems(this.test_datas);
	}
});


Template.ExchangesViewTestDataTableItems.rendered = function() {
	
};

Template.ExchangesViewTestDataTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("exchanges.details_test_data", {testDataId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		TestDatas.update({ _id: this._id }, { $set: values });

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
						TestDatas.remove({ _id: me._id });
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
		Router.go("exchanges.edit_test_data", {testDataId: this._id});
		return false;
	}
});

Template.ExchangesViewTestDataTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return TestDatas.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return TestDatas.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
