var pageSession = new ReactiveDict();

Template.AdminActives.rendered = function() {
	
};

Template.AdminActives.events({
	
});

Template.AdminActives.helpers({
	
});


var actives;
var AdminActivesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminActivesViewSearchString");
	var sortBy = pageSession.get("AdminActivesViewSortBy");
	var sortAscending = pageSession.get("AdminActivesViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["profile.name", "actives"];
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

var AdminActivesViewExport = function(cursor, fileType) {
	var data = AdminActivesViewItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminActivesView.rendered = function() {
	pageSession.set("AdminActivesViewStyle", "table");
	// actives = this.data.active_datas_admin.fetch();
	pageSession.set('actives', this.data.active_datas_admin.fetch());
};

Template.AdminActivesView.events({
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
				pageSession.set("AdminActivesViewSearchString", searchString);
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
					pageSession.set("AdminActivesViewSearchString", searchString);
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
					pageSession.set("AdminActivesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		/**/
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminActivesViewExport(this.admin_users, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminActivesViewExport(this.admin_users, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminActivesViewExport(this.admin_users, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminActivesViewExport(this.admin_users, "json");
	}

	
});

Template.AdminActivesView.helpers({

	

	"isEmpty": function() {
		return !this.admin_users || this.admin_users.count() == 0;
	},
	"isNotEmpty": function() {
		return this.admin_users && this.admin_users.count() > 0;
	},
	"isNotFound": function() {
		return this.admin_users && pageSession.get("AdminActivesViewSearchString") && AdminActivesViewItems(this.admin_users).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminActivesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminActivesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminActivesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminActivesViewStyle") == "gallery";
	},
	"numOfActvs": function(){
		if(typeof pageSession.get('actives') != 'undefined'){
			return pageSession.get('actives').length;
		}
	}

	
});


Template.AdminActivesViewTable.rendered = function() {
	
};

Template.AdminActivesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminActivesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminActivesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminActivesViewSortAscending") || false;
			pageSession.set("AdminActivesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminActivesViewSortAscending", true);
		}
	}
});

Template.AdminActivesViewTable.helpers({
	"tableItems": function() {
		return AdminActivesViewItems(this.admin_users);
	}
});


Template.AdminActivesViewTableItems.rendered = function() {
	
};

Template.AdminActivesViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Users.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #stop-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Stop all active Strategies? Are you sure?",
			title: "Stop Actives",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Meteor.call('stopUserActives', me._id, function(e, r) {
              				if (e) console.log(e);
              			});
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
		/**/
		return false;
	}
});

Template.AdminActivesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Users.isAdmin(Meteor.userId()) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Users.isAdmin(Meteor.userId()) ? "" : "hidden";
	},
	"numOfUserActvs": function(){
		var actives = pageSession.get('actives');
		var cnt = 0;
		for(var i = 0 ; i < actives.length ; i++) {
			if(this._id === actives[i].ownerId) cnt++;
		}

		return cnt;
	}
});
