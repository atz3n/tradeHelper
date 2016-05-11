var pageSession = new ReactiveDict();

Template.Actives.rendered = function() {
  Meteor.ClientCall.setClientId(Meteor.userId());
};

Template.Actives.events({

});

Template.Actives.helpers({

});

var ActivesViewItems = function(cursor) {
  if (!cursor) {
    return [];
  }

  var searchString = pageSession.get("ActivesViewSearchString");
  var sortBy = pageSession.get("ActivesViewSortBy");
  var sortAscending = pageSession.get("ActivesViewSortAscending");
  if (typeof(sortAscending) == "undefined") sortAscending = true;

  var raw = cursor.fetch();

  // filter
  var filtered = [];
  if (!searchString || searchString == "") {
    filtered = raw;
  } else {
    searchString = searchString.replace(".", "\\.");
    var regEx = new RegExp(searchString, "i");
    var searchFields = ["name", "updateTime", "pluginBundles"];
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

var ActivesViewExport = function(cursor, fileType) {
  var data = ActivesViewItems(cursor);
  var exportFields = [];

  var str = convertArrayOfObjects(data, exportFields, fileType);

  var filename = "export." + fileType;

  downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ActivesView.rendered = function() {
  pageSession.set("ActivesViewStyle", "table");

};

Template.ActivesView.events({
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
        pageSession.set("ActivesViewSearchString", searchString);
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
          pageSession.set("ActivesViewSearchString", searchString);
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
          pageSession.set("ActivesViewSearchString", "");
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
    ActivesViewExport(this.strategies_active, "csv");
  },

  "click #dataview-export-csv": function(e, t) {
    e.preventDefault();
    ActivesViewExport(this.strategies_active, "csv");
  },

  "click #dataview-export-tsv": function(e, t) {
    e.preventDefault();
    ActivesViewExport(this.strategies_active, "tsv");
  },

  "click #dataview-export-json": function(e, t) {
    e.preventDefault();
    ActivesViewExport(this.strategies_active, "json");
  }


});

Template.ActivesView.helpers({

  "insertButtonClass": function() {
    return Strategies.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
  },

  "isEmpty": function() {
    return !this.strategies_active || this.strategies_active.count() == 0;
  },
  "isNotEmpty": function() {
    return this.strategies_active && this.strategies_active.count() > 0;
  },
  "isNotFound": function() {
    return this.strategies_active && pageSession.get("ActivesViewSearchString") && ActivesViewItems(this.strategies_active).length == 0;
  },
  "searchString": function() {
    return pageSession.get("ActivesViewSearchString");
  },
  "viewAsTable": function() {
    return pageSession.get("ActivesViewStyle") == "table";
  },
  "viewAsList": function() {
    return pageSession.get("ActivesViewStyle") == "list";
  },
  "viewAsGallery": function() {
    return pageSession.get("ActivesViewStyle") == "gallery";
  }


});


Template.ActivesViewTable.rendered = function() {

};

Template.ActivesViewTable.events({
  "click .th-sortable": function(e, t) {
    e.preventDefault();
    var oldSortBy = pageSession.get("ActivesViewSortBy");
    var newSortBy = $(e.target).attr("data-sort");

    pageSession.set("ActivesViewSortBy", newSortBy);
    if (oldSortBy == newSortBy) {
      var sortAscending = pageSession.get("ActivesViewSortAscending") || false;
      pageSession.set("ActivesViewSortAscending", !sortAscending);
    } else {
      pageSession.set("ActivesViewSortAscending", true);
    }
  }
});

Template.ActivesViewTable.helpers({
  "tableItems": function() {
    return ActivesViewItems(this.strategies_active);
  }
});



Template.ActivesViewTableItems.rendered = function() {

};

Template.ActivesViewTableItems.events({
  "click td": function(e, t) {
    e.preventDefault();

    Router.go("actives.details", { strategyId: this._id });
    return false;
  },

  "click .inline-checkbox": function(e, t) {
    e.preventDefault();

    if (!this || !this._id) return false;

    var fieldName = $(e.currentTarget).attr("data-field");
    if (!fieldName) return false;

    var values = {};
    values[fieldName] = !this[fieldName];

    Strategies.update({ _id: this._id }, { $set: values });

    return false;
  },

  "click #stop-button": function(e, t) {
    e.preventDefault();
    var me = this;
    bootbox.dialog({
      message: "Stop? Are you sure?",
      title: "Stop",
      animate: false,
      buttons: {
        success: {
          label: "Yes",
          className: "btn-success",
          callback: function() {
            Strategies.update({ _id: me._id }, { $set: { status: 'stopped' } });
            Strategies.update({ _id: me._id }, { $set: { paused: false } });
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
  "click #pausePlay-button": function(e, t) {
    e.preventDefault();
    var me = this;
    
    if(Strategies.findOne({ _id: this._id }).paused)
    	Strategies.update({ _id: me._id }, { $set: { paused: false } });
    else
    	Strategies.update({ _id: me._id }, { $set: { paused: true } });
    
    return false;
  },
});

Template.ActivesViewTableItems.helpers({
  "checked": function(value) {
    return value ? "checked" : "" },

  "strategyPaused": function() {
    if (Strategies.findOne({ _id: this._id }).paused)
      return true;
    else
      return false;
  }
});