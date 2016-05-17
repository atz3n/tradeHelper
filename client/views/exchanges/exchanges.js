var pageSession = new ReactiveDict();

Template.Exchanges.rendered = function() {
	
};

Template.Exchanges.events({
	
});

Template.Exchanges.helpers({
	
});

var ExchangesViewExKrakenItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ExchangesViewExKrakenSearchString");
	var sortBy = pageSession.get("ExchangesViewExKrakenSortBy");
	var sortAscending = pageSession.get("ExchangesViewExKrakenSortAscending");
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

var ExchangesViewExKrakenExport = function(cursor, fileType) {
	var data = ExchangesViewExKrakenItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ExchangesViewExKraken.rendered = function() {
	pageSession.set("ExchangesViewExKrakenStyle", "table");
	
};

Template.ExchangesViewExKraken.events({
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
				pageSession.set("ExchangesViewExKrakenSearchString", searchString);
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
					pageSession.set("ExchangesViewExKrakenSearchString", searchString);
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
					pageSession.set("ExchangesViewExKrakenSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("exchanges.insert_ex_kraken", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ExchangesViewExKrakenExport(this.ex_krakens, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ExchangesViewExKrakenExport(this.ex_krakens, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ExchangesViewExKrakenExport(this.ex_krakens, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ExchangesViewExKrakenExport(this.ex_krakens, "json");
	}

	
});

Template.ExchangesViewExKraken.helpers({

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
		return this.ex_krakens && pageSession.get("ExchangesViewExKrakenSearchString") && ExchangesViewExKrakenItems(this.ex_krakens).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ExchangesViewExKrakenSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ExchangesViewExKrakenStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ExchangesViewExKrakenStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ExchangesViewExKrakenStyle") == "gallery";
	}

	
});


Template.ExchangesViewExKrakenTable.rendered = function() {
	
};

Template.ExchangesViewExKrakenTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ExchangesViewExKrakenSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ExchangesViewExKrakenSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ExchangesViewExKrakenSortAscending") || false;
			pageSession.set("ExchangesViewExKrakenSortAscending", !sortAscending);
		} else {
			pageSession.set("ExchangesViewExKrakenSortAscending", true);
		}
	}
});

Template.ExchangesViewExKrakenTable.helpers({
	"tableItems": function() {
		return ExchangesViewExKrakenItems(this.ex_krakens);
	}
});


Template.ExchangesViewExKrakenTableItems.rendered = function() {
	
};

Template.ExchangesViewExKrakenTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("exchanges.details_ex_kraken", {exKrakenId: this._id});
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
		Router.go("exchanges.edit_ex_kraken", {exKrakenId: this._id});
		return false;
	}
});

Template.ExchangesViewExKrakenTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return ExKrakens.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return ExKrakens.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

var ExchangesViewExTestDataItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ExchangesViewExTestDataSearchString");
	var sortBy = pageSession.get("ExchangesViewExTestDataSortBy");
	var sortAscending = pageSession.get("ExchangesViewExTestDataSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "amount", "gain", "counter", "priceType", "data"];
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

var ExchangesViewExTestDataExport = function(cursor, fileType) {
	var data = ExchangesViewExTestDataItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ExchangesViewExTestData.rendered = function() {
	pageSession.set("ExchangesViewExTestDataStyle", "table");
	
};

Template.ExchangesViewExTestData.events({
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
				pageSession.set("ExchangesViewExTestDataSearchString", searchString);
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
					pageSession.set("ExchangesViewExTestDataSearchString", searchString);
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
					pageSession.set("ExchangesViewExTestDataSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("exchanges.insert_ex_test_data", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ExchangesViewExTestDataExport(this.ex_test_datas, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ExchangesViewExTestDataExport(this.ex_test_datas, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ExchangesViewExTestDataExport(this.ex_test_datas, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ExchangesViewExTestDataExport(this.ex_test_datas, "json");
	}

	
});

Template.ExchangesViewExTestData.helpers({

	"insertButtonClass": function() {
		return ExTestDatas.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.ex_test_datas || this.ex_test_datas.count() == 0;
	},
	"isNotEmpty": function() {
		return this.ex_test_datas && this.ex_test_datas.count() > 0;
	},
	"isNotFound": function() {
		return this.ex_test_datas && pageSession.get("ExchangesViewExTestDataSearchString") && ExchangesViewExTestDataItems(this.ex_test_datas).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ExchangesViewExTestDataSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ExchangesViewExTestDataStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ExchangesViewExTestDataStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ExchangesViewExTestDataStyle") == "gallery";
	}

	
});


Template.ExchangesViewExTestDataTable.rendered = function() {
	
};

Template.ExchangesViewExTestDataTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ExchangesViewExTestDataSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ExchangesViewExTestDataSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ExchangesViewExTestDataSortAscending") || false;
			pageSession.set("ExchangesViewExTestDataSortAscending", !sortAscending);
		} else {
			pageSession.set("ExchangesViewExTestDataSortAscending", true);
		}
	}
});

Template.ExchangesViewExTestDataTable.helpers({
	"tableItems": function() {
		return ExchangesViewExTestDataItems(this.ex_test_datas);
	}
});


Template.ExchangesViewExTestDataTableItems.rendered = function() {
	
};

Template.ExchangesViewExTestDataTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("exchanges.details_ex_test_data", {exTestDataId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		ExTestDatas.update({ _id: this._id }, { $set: values });

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
						ExTestDatas.remove({ _id: me._id });
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
		Router.go("exchanges.edit_ex_test_data", {exTestDataId: this._id});
		return false;
	}
});

Template.ExchangesViewExTestDataTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return ExTestDatas.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return ExTestDatas.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
