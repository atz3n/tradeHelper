var pageSession = new ReactiveDict();

Template.Pluginbundles.rendered = function() {
  Session.set('activePage', 'bundles');
};

Template.Pluginbundles.events({

});

Template.Pluginbundles.helpers({

});

var PluginbundlesViewItems = function(cursor) {
  if (!cursor) {
    return [];
  }

  var searchString = pageSession.get("PluginbundlesViewSearchString");
  var sortBy = pageSession.get("PluginbundlesViewSortBy");
  var sortAscending = pageSession.get("PluginbundlesViewSortAscending");
  if (typeof(sortAscending) == "undefined") sortAscending = true;

  var raw = cursor.fetch();

  for (var i = 0; i < raw.length; i++) {

  	var tmp = '';
    for (var j = 0; j < raw[i].bundlePlugins.length; j++) {
    	if(tmp != 0) tmp += ', ';
    	tmp += getPluginName(raw[i].bundlePlugins[j].plugin);
    }
      raw[i].bundlePluginsString = tmp;
  }

  // filter
  var filtered = [];
  if (!searchString || searchString == "") {
    filtered = raw;
  } else {
    searchString = searchString.replace(".", "\\.");
    var regEx = new RegExp(searchString, "i");
    var searchFields = ["name", "bundlePluginsString"];
    filtered = _.filter(raw, function(item) {
      var match = false;
      _.each(searchFields, function(field) {
        var value = (getPropertyValue(field, item) || "") + "";

        match = match || (value && value.match(regEx));
        if (match) {
          return false;
        }
      })
      return match;
    });
  }

  // sort
  if (sortBy) {
    filtered = _.sortBy(filtered, sortBy);

    // descending?
    if (!sortAscending) {
      filtered = filtered.reverse();
    }
  }

  return filtered;
};

var PluginbundlesViewExport = function(cursor, fileType) {
  var data = PluginbundlesViewItems(cursor);
  var exportFields = [];

  var str = convertArrayOfObjects(data, exportFields, fileType);

  var filename = "export." + fileType;

  downloadLocalResource(str, filename, "application/octet-stream");
}


Template.PluginbundlesView.rendered = function() {
  pageSession.set("PluginbundlesViewStyle", "table");

};

Template.PluginbundlesView.events({
  "submit #dataview-controls": function(e, t) {
    return false;
  },

  "click #dataview-search-button": function(e, t) {
    e.preventDefault();
    var form = $(e.currentTarget).parent();
    if (form) {
      var searchInput = form.find("#dataview-search-input");
      if (searchInput) {
        searchInput.focus();
        var searchString = searchInput.val();
        pageSession.set("PluginbundlesViewSearchString", searchString);
      }

    }
    return false;
  },

  "keydown #dataview-search-input": function(e, t) {
    if (e.which === 13) {
      e.preventDefault();
      var form = $(e.currentTarget).parent();
      if (form) {
        var searchInput = form.find("#dataview-search-input");
        if (searchInput) {
          var searchString = searchInput.val();
          pageSession.set("PluginbundlesViewSearchString", searchString);
        }

      }
      return false;
    }

    if (e.which === 27) {
      e.preventDefault();
      var form = $(e.currentTarget).parent();
      if (form) {
        var searchInput = form.find("#dataview-search-input");
        if (searchInput) {
          searchInput.val("");
          pageSession.set("PluginbundlesViewSearchString", "");
        }

      }
      return false;
    }

    return true;
  },

  "click #dataview-insert-button": function(e, t) {
    e.preventDefault();
    Router.go("pluginbundles.insert", {});
  },

  "click #dataview-export-default": function(e, t) {
    e.preventDefault();
    PluginbundlesViewExport(this.pluginbundles, "csv");
  },

  "click #dataview-export-csv": function(e, t) {
    e.preventDefault();
    PluginbundlesViewExport(this.pluginbundles, "csv");
  },

  "click #dataview-export-tsv": function(e, t) {
    e.preventDefault();
    PluginbundlesViewExport(this.pluginbundles, "tsv");
  },

  "click #dataview-export-json": function(e, t) {
    e.preventDefault();
    PluginbundlesViewExport(this.pluginbundles, "json");
  }


});

Template.PluginbundlesView.helpers({

  "insertButtonClass": function() {
    return PluginBundles.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
  },

  "isEmpty": function() {
    return !this.pluginbundles || this.pluginbundles.count() == 0;
  },
  "isNotEmpty": function() {
    return this.pluginbundles && this.pluginbundles.count() > 0;
  },
  "isNotFound": function() {
    return this.pluginbundles && pageSession.get("PluginbundlesViewSearchString") && PluginbundlesViewItems(this.pluginbundles).length == 0;
  },
  "searchString": function() {
    return pageSession.get("PluginbundlesViewSearchString");
  },
  "viewAsTable": function() {
    return pageSession.get("PluginbundlesViewStyle") == "table";
  },
  "viewAsList": function() {
    return pageSession.get("PluginbundlesViewStyle") == "list";
  },
  "viewAsGallery": function() {
    return pageSession.get("PluginbundlesViewStyle") == "gallery";
  }


});


Template.PluginbundlesViewTable.rendered = function() {

};

Template.PluginbundlesViewTable.events({
  "click .th-sortable": function(e, t) {
    e.preventDefault();
    var oldSortBy = pageSession.get("PluginbundlesViewSortBy");
    var newSortBy = $(e.target).attr("data-sort");

    pageSession.set("PluginbundlesViewSortBy", newSortBy);
    if (oldSortBy == newSortBy) {
      var sortAscending = pageSession.get("PluginbundlesViewSortAscending") || false;
      pageSession.set("PluginbundlesViewSortAscending", !sortAscending);
    } else {
      pageSession.set("PluginbundlesViewSortAscending", true);
    }
  }
});

Template.PluginbundlesViewTable.helpers({
  "tableItems": function() {
    return PluginbundlesViewItems(this.pluginbundles);
  }
});


Template.PluginbundlesViewTableItems.rendered = function() {

};

Template.PluginbundlesViewTableItems.events({
  "click td": function(e, t) {
    e.preventDefault();

    Router.go("pluginbundles.details", { pluginbundleId: this._id });
    return false;
  },

  "click .inline-checkbox": function(e, t) {
    e.preventDefault();

    if (!this || !this._id) return false;

    var fieldName = $(e.currentTarget).attr("data-field");
    if (!fieldName) return false;

    var values = {};
    values[fieldName] = !this[fieldName];

    PluginBundles.update({ _id: this._id }, { $set: values });

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
            PluginBundles.remove({ _id: me._id });
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
    Router.go("pluginbundles.edit", { pluginbundleId: this._id });
    return false;
  },
  "click #actives-button": function(e, t) {
    e.preventDefault();
    Router.go("actives");
    return false;
  }
});

Template.PluginbundlesViewTableItems.helpers({
  "checked": function(value) {
    return value ? "checked" : "" },
  "editButtonClass": function() {
    return PluginBundles.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
  },

  "deleteButtonClass": function() {
    return PluginBundles.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
  },
  "rowClass": function() {
    if(this.actives > 0) return "warning";
    else return "default";
  }
});
