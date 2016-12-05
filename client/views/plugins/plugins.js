var pageSession = new ReactiveDict();

Template.Plugins.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.Plugins.events({
	
});

Template.Plugins.helpers({
	
});


var PluginsViewPlStopLossesItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewPlStopLossesSearchString");
	var sortBy = pageSession.get("PluginsViewPlStopLossesSortBy");
	var sortAscending = pageSession.get("PluginsViewPlStopLossesSortAscending");
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

var PluginsViewPlStopLossesExport = function(cursor, fileType) {
	var data = PluginsViewPlStopLossesItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsViewPlStopLosses.rendered = function() {
	pageSession.set("PluginsViewPlStopLossesStyle", "table");
	
};

Template.PluginsViewPlStopLosses.events({
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
				pageSession.set("PluginsViewPlStopLossesSearchString", searchString);
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
					pageSession.set("PluginsViewPlStopLossesSearchString", searchString);
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
					pageSession.set("PluginsViewPlStopLossesSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.insert_pl_stop_loss", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsViewPlStopLossesExport(this.pl_stop_losses, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsViewPlStopLossesExport(this.pl_stop_losses, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsViewPlStopLossesExport(this.pl_stop_losses, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsViewPlStopLossesExport(this.pl_stop_losses, "json");
	}

	
});

Template.PluginsViewPlStopLosses.helpers({

	"insertButtonClass": function() {
		return PlStopLosses.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_stop_losses || this.pl_stop_losses.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_stop_losses && this.pl_stop_losses.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_stop_losses && pageSession.get("PluginsViewPlStopLossesSearchString") && PluginsViewPlStopLossesItems(this.pl_stop_losses).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsViewPlStopLossesSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsViewPlStopLossesStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsViewPlStopLossesStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsViewPlStopLossesStyle") == "gallery";
	}

	
});


Template.PluginsViewPlStopLossesTable.rendered = function() {
	
};

Template.PluginsViewPlStopLossesTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsViewPlStopLossesSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsViewPlStopLossesSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsViewPlStopLossesSortAscending") || false;
			pageSession.set("PluginsViewPlStopLossesSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsViewPlStopLossesSortAscending", true);
		}
	}
});

Template.PluginsViewPlStopLossesTable.helpers({
	"tableItems": function() {
		return PluginsViewPlStopLossesItems(this.pl_stop_losses);
	}
});


Template.PluginsViewPlStopLossesTableItems.rendered = function() {
	
};

Template.PluginsViewPlStopLossesTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.details_pl_stop_loss", {plStopLossId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlStopLosses.update({ _id: this._id }, { $set: values });

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
						PlStopLosses.remove({ _id: me._id });
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
		Router.go("plugins.edit_pl_stop_loss", {plStopLossId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsViewPlStopLossesTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlStopLosses.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlStopLosses.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});

var PluginsViewPlTakeProfitsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewPlTakeProfitsSearchString");
	var sortBy = pageSession.get("PluginsViewPlTakeProfitsSortBy");
	var sortAscending = pageSession.get("PluginsViewPlTakeProfitsSortAscending");
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
		var searchFields = ["name", "exchange", "takeValueType", "takeValueAmount", "enLong", "enShort"];
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

var PluginsViewPlTakeProfitsExport = function(cursor, fileType) {
	var data = PluginsViewPlTakeProfitsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsViewPlTakeProfits.rendered = function() {
	pageSession.set("PluginsViewPlTakeProfitsStyle", "table");
	
};

Template.PluginsViewPlTakeProfits.events({
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
				pageSession.set("PluginsViewPlTakeProfitsSearchString", searchString);
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
					pageSession.set("PluginsViewPlTakeProfitsSearchString", searchString);
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
					pageSession.set("PluginsViewPlTakeProfitsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.insert_pl_take_profit", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsViewPlTakeProfitsExport(this.pl_take_profits, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsViewPlTakeProfitsExport(this.pl_take_profits, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsViewPlTakeProfitsExport(this.pl_take_profits, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsViewPlTakeProfitsExport(this.pl_take_profits, "json");
	}

	
});

Template.PluginsViewPlTakeProfits.helpers({

	"insertButtonClass": function() {
		return PlTakeProfits.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_take_profits || this.pl_take_profits.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_take_profits && this.pl_take_profits.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_take_profits && pageSession.get("PluginsViewPlTakeProfitsSearchString") && PluginsViewPlTakeProfitsItems(this.pl_take_profits).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsViewPlTakeProfitsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsViewPlTakeProfitsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsViewPlTakeProfitsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsViewPlTakeProfitsStyle") == "gallery";
	}

	
});


Template.PluginsViewPlTakeProfitsTable.rendered = function() {
	
};

Template.PluginsViewPlTakeProfitsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsViewPlTakeProfitsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsViewPlTakeProfitsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsViewPlTakeProfitsSortAscending") || false;
			pageSession.set("PluginsViewPlTakeProfitsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsViewPlTakeProfitsSortAscending", true);
		}
	}
});

Template.PluginsViewPlTakeProfitsTable.helpers({
	"tableItems": function() {
		return PluginsViewPlTakeProfitsItems(this.pl_take_profits);
	}
});


Template.PluginsViewPlTakeProfitsTableItems.rendered = function() {
	
};

Template.PluginsViewPlTakeProfitsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.details_pl_take_profit", {plTakeProfitId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlTakeProfits.update({ _id: this._id }, { $set: values });

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
						PlTakeProfits.remove({ _id: me._id });
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
		Router.go("plugins.edit_pl_take_profit", {plTakeProfitId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsViewPlTakeProfitsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlTakeProfits.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlTakeProfits.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});

var PluginsViewPlThresholdInsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewPlThresholdInsSearchString");
	var sortBy = pageSession.get("PluginsViewPlThresholdInsSortBy");
	var sortAscending = pageSession.get("PluginsViewPlThresholdInsSortAscending");
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

var PluginsViewPlThresholdInsExport = function(cursor, fileType) {
	var data = PluginsViewPlThresholdInsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsViewPlThresholdIns.rendered = function() {
	pageSession.set("PluginsViewPlThresholdInsStyle", "table");
	
};

Template.PluginsViewPlThresholdIns.events({
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
				pageSession.set("PluginsViewPlThresholdInsSearchString", searchString);
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
					pageSession.set("PluginsViewPlThresholdInsSearchString", searchString);
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
					pageSession.set("PluginsViewPlThresholdInsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.insert_pl_threshold_in", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsViewPlThresholdInsExport(this.pl_threshold_ins, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsViewPlThresholdInsExport(this.pl_threshold_ins, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsViewPlThresholdInsExport(this.pl_threshold_ins, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsViewPlThresholdInsExport(this.pl_threshold_ins, "json");
	}

	
});

Template.PluginsViewPlThresholdIns.helpers({

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
		return this.pl_threshold_ins && pageSession.get("PluginsViewPlThresholdInsSearchString") && PluginsViewPlThresholdInsItems(this.pl_threshold_ins).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsViewPlThresholdInsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsViewPlThresholdInsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsViewPlThresholdInsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsViewPlThresholdInsStyle") == "gallery";
	}

	
});


Template.PluginsViewPlThresholdInsTable.rendered = function() {
	
};

Template.PluginsViewPlThresholdInsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsViewPlThresholdInsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsViewPlThresholdInsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsViewPlThresholdInsSortAscending") || false;
			pageSession.set("PluginsViewPlThresholdInsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsViewPlThresholdInsSortAscending", true);
		}
	}
});

Template.PluginsViewPlThresholdInsTable.helpers({
	"tableItems": function() {
		return PluginsViewPlThresholdInsItems(this.pl_threshold_ins);
	}
});


Template.PluginsViewPlThresholdInsTableItems.rendered = function() {
	
};

Template.PluginsViewPlThresholdInsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.details_pl_threshold_in", {plThresholdInId: this._id});
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
		Router.go("plugins.edit_pl_threshold_in", {plThresholdInId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsViewPlThresholdInsTableItems.helpers({
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

var PluginsViewPlThresholdOutsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewPlThresholdOutsSearchString");
	var sortBy = pageSession.get("PluginsViewPlThresholdOutsSortBy");
	var sortAscending = pageSession.get("PluginsViewPlThresholdOutsSortAscending");
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
		var searchFields = ["name", "exchange", "thresholdBaseBase", "thresholdType", "thresholdAmount", "enLong", "enShort"];
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

var PluginsViewPlThresholdOutsExport = function(cursor, fileType) {
	var data = PluginsViewPlThresholdOutsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsViewPlThresholdOuts.rendered = function() {
	pageSession.set("PluginsViewPlThresholdOutsStyle", "table");
	
};

Template.PluginsViewPlThresholdOuts.events({
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
				pageSession.set("PluginsViewPlThresholdOutsSearchString", searchString);
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
					pageSession.set("PluginsViewPlThresholdOutsSearchString", searchString);
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
					pageSession.set("PluginsViewPlThresholdOutsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.insert_pl_threshold_out", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsViewPlThresholdOutsExport(this.pl_threshold_outs, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsViewPlThresholdOutsExport(this.pl_threshold_outs, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsViewPlThresholdOutsExport(this.pl_threshold_outs, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsViewPlThresholdOutsExport(this.pl_threshold_outs, "json");
	}

	
});

Template.PluginsViewPlThresholdOuts.helpers({

	"insertButtonClass": function() {
		return PlThresholdOuts.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_threshold_outs || this.pl_threshold_outs.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_threshold_outs && this.pl_threshold_outs.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_threshold_outs && pageSession.get("PluginsViewPlThresholdOutsSearchString") && PluginsViewPlThresholdOutsItems(this.pl_threshold_outs).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsViewPlThresholdOutsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsViewPlThresholdOutsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsViewPlThresholdOutsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsViewPlThresholdOutsStyle") == "gallery";
	}

	
});


Template.PluginsViewPlThresholdOutsTable.rendered = function() {
	
};

Template.PluginsViewPlThresholdOutsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsViewPlThresholdOutsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsViewPlThresholdOutsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsViewPlThresholdOutsSortAscending") || false;
			pageSession.set("PluginsViewPlThresholdOutsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsViewPlThresholdOutsSortAscending", true);
		}
	}
});

Template.PluginsViewPlThresholdOutsTable.helpers({
	"tableItems": function() {
		return PluginsViewPlThresholdOutsItems(this.pl_threshold_outs);
	}
});


Template.PluginsViewPlThresholdOutsTableItems.rendered = function() {
	
};

Template.PluginsViewPlThresholdOutsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.details_pl_threshold_out", {plThresholdOutId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlThresholdOuts.update({ _id: this._id }, { $set: values });

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
						PlThresholdOuts.remove({ _id: me._id });
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
		Router.go("plugins.edit_pl_threshold_out", {plThresholdOutId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsViewPlThresholdOutsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlThresholdOuts.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlThresholdOuts.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
});
