var pageSession = new ReactiveDict();

Template.ExchangesKrakenCom.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.ExchangesKrakenCom.events({
	
});

Template.ExchangesKrakenCom.helpers({
	
});

var ExchangesKrakenComViewExKrakenItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ExchangesKrakenComViewExKrakenSearchString");
	var sortBy = pageSession.get("ExchangesKrakenComViewExKrakenSortBy");
	var sortAscending = pageSession.get("ExchangesKrakenComViewExKrakenSortAscending");
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

var ExchangesKrakenComViewExKrakenExport = function(cursor, fileType) {
	var data = ExchangesKrakenComViewExKrakenItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ExchangesKrakenComViewExKraken.rendered = function() {
	pageSession.set("ExchangesKrakenComViewExKrakenStyle", "table");
	
};

Template.ExchangesKrakenComViewExKraken.events({
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
				pageSession.set("ExchangesKrakenComViewExKrakenSearchString", searchString);
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
					pageSession.set("ExchangesKrakenComViewExKrakenSearchString", searchString);
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
					pageSession.set("ExchangesKrakenComViewExKrakenSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("exchanges.kraken_com.insert_ex_kraken", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ExchangesKrakenComViewExKrakenExport(this.ex_krakens, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ExchangesKrakenComViewExKrakenExport(this.ex_krakens, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ExchangesKrakenComViewExKrakenExport(this.ex_krakens, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ExchangesKrakenComViewExKrakenExport(this.ex_krakens, "json");
	}

	
});

Template.ExchangesKrakenComViewExKraken.helpers({

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
		return this.ex_krakens && pageSession.get("ExchangesKrakenComViewExKrakenSearchString") && ExchangesKrakenComViewExKrakenItems(this.ex_krakens).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ExchangesKrakenComViewExKrakenSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ExchangesKrakenComViewExKrakenStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ExchangesKrakenComViewExKrakenStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ExchangesKrakenComViewExKrakenStyle") == "gallery";
	}

	
});


Template.ExchangesKrakenComViewExKrakenTable.rendered = function() {
	
};

Template.ExchangesKrakenComViewExKrakenTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ExchangesKrakenComViewExKrakenSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ExchangesKrakenComViewExKrakenSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ExchangesKrakenComViewExKrakenSortAscending") || false;
			pageSession.set("ExchangesKrakenComViewExKrakenSortAscending", !sortAscending);
		} else {
			pageSession.set("ExchangesKrakenComViewExKrakenSortAscending", true);
		}
	}
});

Template.ExchangesKrakenComViewExKrakenTable.helpers({
	"tableItems": function() {
		return ExchangesKrakenComViewExKrakenItems(this.ex_krakens);
	}
});


Template.ExchangesKrakenComViewExKrakenTableItems.rendered = function() {
	
};

Template.ExchangesKrakenComViewExKrakenTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("exchanges.kraken_com.details_ex_kraken", {exKrakenId: this._id});
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
		Router.go("exchanges.kraken_com.edit_ex_kraken", {exKrakenId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.ExchangesKrakenComViewExKrakenTableItems.helpers({
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










































// var ExchangesKrakenComViewExKrakenItems = function(cursor) {
// 	if(!cursor) {
// 		return [];
// 	}

// 	var searchString = pageSession.get("ExchangesKrakenComViewExKrakenSearchString");
// 	var sortBy = pageSession.get("ExchangesKrakenComViewExKrakenSortBy");
// 	var sortAscending = pageSession.get("ExchangesKrakenComViewExKrakenSortAscending");
// 	if(typeof(sortAscending) == "undefined") sortAscending = true;

// 	var raw = cursor.fetch();

// 	// filter
// 	var filtered = [];
// 	if(!searchString || searchString == "") {
// 		filtered = raw;
// 	} else {
// 		searchString = searchString.replace(".", "\\.");
// 		var regEx = new RegExp(searchString, "i");
// 		var searchFields = ["name", "pair", "priceType", "trAvType", "trAvVal", "orderType", "conErrorCycles", "conErrorWaitSec", "orderCheckWaitSec", "hotMode", "balanceType", "oBalanceAmount", "key", "secret"];
// 		filtered = _.filter(raw, function(item) {
// 			var match = false;
// 			_.each(searchFields, function(field) {
// 				var value = (getPropertyValue(field, item) || "") + "";

// 				match = match || (value && value.match(regEx));
// 				if(match) {
// 					return false;
// 				}
// 			})
// 			return match;
// 		});
// 	}

// 	// sort
// 	if(sortBy) {
// 		filtered = _.sortBy(filtered, sortBy);

// 		// descending?
// 		if(!sortAscending) {
// 			filtered = filtered.reverse();
// 		}
// 	}

// 	return filtered;
// };

// var ExchangesKrakenComViewExKrakenExport = function(cursor, fileType) {
// 	var data = ExchangesKrakenComViewExKrakenItems(cursor);
// 	var exportFields = [];

// 	var str = convertArrayOfObjects(data, exportFields, fileType);

// 	var filename = "export." + fileType;

// 	downloadLocalResource(str, filename, "application/octet-stream");
// }


// Template.ExchangesKrakenComViewExKraken.rendered = function() {
// 	pageSession.set("ExchangesKrakenComViewExKrakenStyle", "table");
	
// };

// Template.ExchangesKrakenComViewExKraken.events({
// 	"submit #dataview-controls": function(e, t) {
// 		return false;
// 	},

// 	"click #dataview-search-button": function(e, t) {
// 		e.preventDefault();
// 		var form = $(e.currentTarget).parent();
// 		if(form) {
// 			var searchInput = form.find("#dataview-search-input");
// 			if(searchInput) {
// 				searchInput.focus();
// 				var searchString = searchInput.val();
// 				pageSession.set("ExchangesKrakenComViewExKrakenSearchString", searchString);
// 			}

// 		}
// 		return false;
// 	},

// 	"keydown #dataview-search-input": function(e, t) {
// 		if(e.which === 13)
// 		{
// 			e.preventDefault();
// 			var form = $(e.currentTarget).parent();
// 			if(form) {
// 				var searchInput = form.find("#dataview-search-input");
// 				if(searchInput) {
// 					var searchString = searchInput.val();
// 					pageSession.set("ExchangesKrakenComViewExKrakenSearchString", searchString);
// 				}

// 			}
// 			return false;
// 		}

// 		if(e.which === 27)
// 		{
// 			e.preventDefault();
// 			var form = $(e.currentTarget).parent();
// 			if(form) {
// 				var searchInput = form.find("#dataview-search-input");
// 				if(searchInput) {
// 					searchInput.val("");
// 					pageSession.set("ExchangesKrakenComViewExKrakenSearchString", "");
// 				}

// 			}
// 			return false;
// 		}

// 		return true;
// 	},

// 	"click #dataview-insert-button": function(e, t) {
// 		e.preventDefault();
// 		Router.go("exchanges.kraken_com.insert_ex_kraken", {});
// 	},

// 	"click #dataview-export-default": function(e, t) {
// 		e.preventDefault();
// 		ExchangesKrakenComViewExKrakenExport(this.ex_krakens, "csv");
// 	},

// 	"click #dataview-export-csv": function(e, t) {
// 		e.preventDefault();
// 		ExchangesKrakenComViewExKrakenExport(this.ex_krakens, "csv");
// 	},

// 	"click #dataview-export-tsv": function(e, t) {
// 		e.preventDefault();
// 		ExchangesKrakenComViewExKrakenExport(this.ex_krakens, "tsv");
// 	},

// 	"click #dataview-export-json": function(e, t) {
// 		e.preventDefault();
// 		ExchangesKrakenComViewExKrakenExport(this.ex_krakens, "json");
// 	}

	
// });

// Template.ExchangesKrakenComViewExKraken.helpers({

// 	"insertButtonClass": function() {
// 		return ExKrakens.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
// 	},

// 	"isEmpty": function() {
// 		return !this.ex_krakens || this.ex_krakens.count() == 0;
// 	},
// 	"isNotEmpty": function() {
// 		return this.ex_krakens && this.ex_krakens.count() > 0;
// 	},
// 	"isNotFound": function() {
// 		return this.ex_krakens && pageSession.get("ExchangesKrakenComViewExKrakenSearchString") && ExchangesKrakenComViewExKrakenItems(this.ex_krakens).length == 0;
// 	},
// 	"searchString": function() {
// 		return pageSession.get("ExchangesKrakenComViewExKrakenSearchString");
// 	},
// 	"viewAsTable": function() {
// 		return pageSession.get("ExchangesKrakenComViewExKrakenStyle") == "table";
// 	},
// 	"viewAsList": function() {
// 		return pageSession.get("ExchangesKrakenComViewExKrakenStyle") == "list";
// 	},
// 	"viewAsGallery": function() {
// 		return pageSession.get("ExchangesKrakenComViewExKrakenStyle") == "gallery";
// 	}

	
// });


// Template.ExchangesKrakenComViewExKrakenTable.rendered = function() {
	
// };

// Template.ExchangesKrakenComViewExKrakenTable.events({
// 	"click .th-sortable": function(e, t) {
// 		e.preventDefault();
// 		var oldSortBy = pageSession.get("ExchangesKrakenComViewExKrakenSortBy");
// 		var newSortBy = $(e.target).attr("data-sort");

// 		pageSession.set("ExchangesKrakenComViewExKrakenSortBy", newSortBy);
// 		if(oldSortBy == newSortBy) {
// 			var sortAscending = pageSession.get("ExchangesKrakenComViewExKrakenSortAscending") || false;
// 			pageSession.set("ExchangesKrakenComViewExKrakenSortAscending", !sortAscending);
// 		} else {
// 			pageSession.set("ExchangesKrakenComViewExKrakenSortAscending", true);
// 		}
// 	}
// });

// Template.ExchangesKrakenComViewExKrakenTable.helpers({
// 	"tableItems": function() {
// 		return ExchangesKrakenComViewExKrakenItems(this.ex_krakens);
// 	}
// });


// Template.ExchangesKrakenComViewExKrakenTableItems.rendered = function() {
	
// };

// Template.ExchangesKrakenComViewExKrakenTableItems.events({
// 	"click td": function(e, t) {
// 		e.preventDefault();
		
// 		Router.go("exchanges.kraken_com.details_ex_kraken", {exKrakenId: this._id});
// 		return false;
// 	},

// 	"click .inline-checkbox": function(e, t) {
// 		e.preventDefault();

// 		if(!this || !this._id) return false;

// 		var fieldName = $(e.currentTarget).attr("data-field");
// 		if(!fieldName) return false;

// 		var values = {};
// 		values[fieldName] = !this[fieldName];

// 		ExKrakens.update({ _id: this._id }, { $set: values });

// 		return false;
// 	},

// 	"click #delete-button": function(e, t) {
// 		e.preventDefault();
// 		var me = this;
// 		bootbox.dialog({
// 			message: "Delete? Are you sure?",
// 			title: "Delete",
// 			animate: false,
// 			buttons: {
// 				success: {
// 					label: "Yes",
// 					className: "btn-success",
// 					callback: function() {
// 						ExKrakens.remove({ _id: me._id });
// 					}
// 				},
// 				danger: {
// 					label: "No",
// 					className: "btn-default"
// 				}
// 			}
// 		});
// 		return false;
// 	},
// 	"click #edit-button": function(e, t) {
// 		e.preventDefault();
// 		Router.go("exchanges.kraken_com.edit_ex_kraken", {exKrakenId: this._id});
// 		return false;
// 	}
// });

// Template.ExchangesKrakenComViewExKrakenTableItems.helpers({
// 	"checked": function(value) { return value ? "checked" : "" }, 
// 	"editButtonClass": function() {
// 		return ExKrakens.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
// 	},

// 	"deleteButtonClass": function() {
// 		return ExKrakens.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
// 	}
// });
