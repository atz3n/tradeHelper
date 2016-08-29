var pageSession = new ReactiveDict();

Template.Forum.rendered = function() {
	Session.set('activePage', 'forum');
};

Template.Forum.events({
	
});

Template.Forum.helpers({
	
});

var ForumViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ForumViewSearchString");
	var sortBy = pageSession.get("ForumViewSortBy");
	var sortAscending = pageSession.get("ForumViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["topicNum", "title", "desc"];
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

var ForumViewExport = function(cursor, fileType) {
	var data = ForumViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ForumView.rendered = function() {
	pageSession.set("ForumViewStyle", "table");
	
};

Template.ForumView.events({
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
				pageSession.set("ForumViewSearchString", searchString);
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
					pageSession.set("ForumViewSearchString", searchString);
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
					pageSession.set("ForumViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("forum.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ForumViewExport(this.topics, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ForumViewExport(this.topics, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ForumViewExport(this.topics, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ForumViewExport(this.topics, "json");
	}

	
});

Template.ForumView.helpers({

	"insertButtonClass": function() {
		return Topics.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.topics || this.topics.count() == 0;
	},
	"isNotEmpty": function() {
		return this.topics && this.topics.count() > 0;
	},
	"isNotFound": function() {
		return this.topics && pageSession.get("ForumViewSearchString") && ForumViewItems(this.topics).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ForumViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ForumViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ForumViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ForumViewStyle") == "gallery";
	}

	
});


Template.ForumViewTable.rendered = function() {
	
};

Template.ForumViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ForumViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ForumViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ForumViewSortAscending") || false;
			pageSession.set("ForumViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ForumViewSortAscending", true);
		}
	}
});

Template.ForumViewTable.helpers({
	"tableItems": function() {
		return ForumViewItems(this.topics);
	}
});


Template.ForumViewTableItems.rendered = function() {
	
};

Template.ForumViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("forum.details", {topicId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Topics.update({ _id: this._id }, { $set: values });

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
						Topics.remove({ _id: me._id });
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
		Router.go("forum.edit", {topicId: this._id});
		return false;
	}
});

Template.ForumViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Topics.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Topics.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
