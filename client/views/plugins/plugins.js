var pageSession = new ReactiveDict();

Template.Plugins.rendered = function() {
	Session.set('activePage', 'plugins');
};

Template.Plugins.events({
	
});

Template.Plugins.helpers({
	
});

var PluginsViewPlSwingsItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PluginsViewPlSwingsSearchString");
	var sortBy = pageSession.get("PluginsViewPlSwingsSortBy");
	var sortAscending = pageSession.get("PluginsViewPlSwingsSortAscending");
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

var PluginsViewPlSwingsExport = function(cursor, fileType) {
	var data = PluginsViewPlSwingsItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginsViewPlSwings.rendered = function() {
	pageSession.set("PluginsViewPlSwingsStyle", "table");
	
};

Template.PluginsViewPlSwings.events({
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
				pageSession.set("PluginsViewPlSwingsSearchString", searchString);
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
					pageSession.set("PluginsViewPlSwingsSearchString", searchString);
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
					pageSession.set("PluginsViewPlSwingsSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("plugins.insert_pl_swing", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PluginsViewPlSwingsExport(this.pl_swings, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PluginsViewPlSwingsExport(this.pl_swings, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PluginsViewPlSwingsExport(this.pl_swings, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PluginsViewPlSwingsExport(this.pl_swings, "json");
	}

	
});

Template.PluginsViewPlSwings.helpers({

	"insertButtonClass": function() {
		return PlSwings.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.pl_swings || this.pl_swings.count() == 0;
	},
	"isNotEmpty": function() {
		return this.pl_swings && this.pl_swings.count() > 0;
	},
	"isNotFound": function() {
		return this.pl_swings && pageSession.get("PluginsViewPlSwingsSearchString") && PluginsViewPlSwingsItems(this.pl_swings).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PluginsViewPlSwingsSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PluginsViewPlSwingsStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("PluginsViewPlSwingsStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PluginsViewPlSwingsStyle") == "gallery";
	}

	
});


Template.PluginsViewPlSwingsTable.rendered = function() {
	
};

Template.PluginsViewPlSwingsTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PluginsViewPlSwingsSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PluginsViewPlSwingsSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PluginsViewPlSwingsSortAscending") || false;
			pageSession.set("PluginsViewPlSwingsSortAscending", !sortAscending);
		} else {
			pageSession.set("PluginsViewPlSwingsSortAscending", true);
		}
	}
});

Template.PluginsViewPlSwingsTable.helpers({
	"tableItems": function() {
		return PluginsViewPlSwingsItems(this.pl_swings);
	}
});


Template.PluginsViewPlSwingsTableItems.rendered = function() {
	
};

Template.PluginsViewPlSwingsTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("plugins.details_pl_swing", {plSwingId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		PlSwings.update({ _id: this._id }, { $set: values });

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
						PlSwings.remove({ _id: me._id });
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
		Router.go("plugins.edit_pl_swing", {plSwingId: this._id});
		return false;
	},
	"click #actives-button": function(e, t) {
		e.preventDefault();
		Router.go("actives");
		return false;
	}
});

Template.PluginsViewPlSwingsTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return PlSwings.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return PlSwings.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	"rowClass": function() {
		if(this.actives > 0) return "warning";
		else return "default";
	}
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
