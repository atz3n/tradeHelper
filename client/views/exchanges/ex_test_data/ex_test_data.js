var pageSession = new ReactiveDict();

Template.ExchangesExTestData.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.ExchangesExTestData.events({
	
});

Template.ExchangesExTestData.helpers({
	
});



var ExchangesExTestDataViewExTestDataItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ExchangesExTestDataViewExTestDataSearchString");
	var sortBy = pageSession.get("ExchangesExTestDataViewExTestDataSortBy");
	var sortAscending = pageSession.get("ExchangesExTestDataViewExTestDataSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "timeUnit", "balanceAmount", "gain", "offset", "startVal", "stepWidth", "tradeDelaySec", "priceType", "data"];
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

var ExchangesExTestDataViewExTestDataExport = function(cursor, fileType) {
	var data = ExchangesExTestDataViewExTestDataItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ExchangesExTestDataViewExTestData.rendered = function() {
	pageSession.set("ExchangesExTestDataViewExTestDataStyle", "table");
	
};

Template.ExchangesExTestDataViewExTestData.events({
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
				pageSession.set("ExchangesExTestDataViewExTestDataSearchString", searchString);
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
					pageSession.set("ExchangesExTestDataViewExTestDataSearchString", searchString);
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
					pageSession.set("ExchangesExTestDataViewExTestDataSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("exchanges.ex_test_data.insert_ex_test_data", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ExchangesExTestDataViewExTestDataExport(this.ex_test_datas, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ExchangesExTestDataViewExTestDataExport(this.ex_test_datas, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ExchangesExTestDataViewExTestDataExport(this.ex_test_datas, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ExchangesExTestDataViewExTestDataExport(this.ex_test_datas, "json");
	}

	
});

Template.ExchangesExTestDataViewExTestData.helpers({

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
		return this.ex_test_datas && pageSession.get("ExchangesExTestDataViewExTestDataSearchString") && ExchangesExTestDataViewExTestDataItems(this.ex_test_datas).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ExchangesExTestDataViewExTestDataSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ExchangesExTestDataViewExTestDataStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ExchangesExTestDataViewExTestDataStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ExchangesExTestDataViewExTestDataStyle") == "gallery";
	}

	
});


Template.ExchangesExTestDataViewExTestDataTable.rendered = function() {
	
};

Template.ExchangesExTestDataViewExTestDataTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ExchangesExTestDataViewExTestDataSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ExchangesExTestDataViewExTestDataSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ExchangesExTestDataViewExTestDataSortAscending") || false;
			pageSession.set("ExchangesExTestDataViewExTestDataSortAscending", !sortAscending);
		} else {
			pageSession.set("ExchangesExTestDataViewExTestDataSortAscending", true);
		}
	}
});

Template.ExchangesExTestDataViewExTestDataTable.helpers({
	"tableItems": function() {
		return ExchangesExTestDataViewExTestDataItems(this.ex_test_datas);
	}
});


Template.ExchangesExTestDataViewExTestDataTableItems.rendered = function() {
	
};

Template.ExchangesExTestDataViewExTestDataTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("exchanges.ex_test_data.details_ex_test_data", {exTestDataId: this._id});
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
		Router.go("exchanges.ex_test_data.edit_ex_test_data", {exTestDataId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.ExchangesExTestDataViewExTestDataTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return ExTestDatas.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return ExTestDatas.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});