var pageSession = new ReactiveDict();

Template.HistoryStrHistory.rendered = function() {
  Session.set('activePage', 'history');
};

Template.HistoryStrHistory.events({

});

Template.HistoryStrHistory.helpers({

});

var HistoryStrHistoryViewItems = function(cursor) {
  if (!cursor) {
    return [];
  }

  var searchString = pageSession.get("HistoryStrHistoryViewSearchString");
  var sortBy = pageSession.get("HistoryStrHistoryViewSortBy");
  var sortAscending = pageSession.get("HistoryStrHistoryViewSortAscending");
  if (typeof(sortAscending) == "undefined") sortAscending = true;

  var raw = cursor.fetch();

  for (i in raw) {

    raw[i].costIn = '';
    raw[i].profit = '';
    raw[i].costOut = '';

    for (j in raw[i].exchanges) {
      var tmp = raw[i].exchanges[j];

      if (j != 0) raw[i].costIn += ', ';
      if (j != 0) raw[i].profit += ', ';
      if (j != 0) raw[i].costOut += ', ';

      var cosIn = tmp.inPrice * tmp.volume;
      var cosOut = tmp.outPrice * tmp.volume;

      raw[i].costIn += cropFracDigits(cosIn, 3);
      raw[i].costOut += cropFracDigits(cosOut, 3);

      var tmpP = cropFracDigits(percentage(cosOut, cosIn), 2);
      var tmpT = cropFracDigits(cosOut - cosIn, 2);
      if (raw[i].position === 'short') {
      	tmpP *= -1;
        tmpT *= -1;
      }

      if (tmp.units.base != '' && tmp.units.quote != '') {
        raw[i].costIn += tmp.units.quote;
        raw[i].costOut += tmp.units.quote;
        raw[i].profit += tmpT + tmp.units.quote + ' (' + tmpP + '%)';
      } else {
        raw[i].profit += tmpT + ' (' + tmpP + '%)';
      }
    }
  }

  raw = raw.sort(function(a,b){
    return moment(a.createdAt - b.createdAt);
  });


  // filter
  var filtered = [];
  if (!searchString || searchString == "") {
    filtered = raw;
  } else {
    searchString = searchString.replace(".", "\\.");
    var regEx = new RegExp(searchString, "i");
    var searchFields = ["name", "date", "costIn", "costOut", "profit", "position"];
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

var HistoryStrHistoryViewExport = function(cursor, fileType) {
  var data = HistoryStrHistoryViewItems(cursor);
  var exportFields = [];

  var str = convertArrayOfObjects(data, exportFields, fileType);

  var filename = "export." + fileType;

  downloadLocalResource(str, filename, "application/octet-stream");
}


Template.HistoryStrHistoryView.rendered = function() {
  pageSession.set("HistoryStrHistoryViewStyle", "table");

};

Template.HistoryStrHistoryView.events({
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
        pageSession.set("HistoryStrHistoryViewSearchString", searchString);
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
          pageSession.set("HistoryStrHistoryViewSearchString", searchString);
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
          pageSession.set("HistoryStrHistoryViewSearchString", "");
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
    HistoryStrHistoryViewExport(this.str_histories, "csv");
  },

  "click #dataview-export-csv": function(e, t) {
    e.preventDefault();
    HistoryStrHistoryViewExport(this.str_histories, "csv");
  },

  "click #dataview-export-tsv": function(e, t) {
    e.preventDefault();
    HistoryStrHistoryViewExport(this.str_histories, "tsv");
  },

  "click #dataview-export-json": function(e, t) {
    e.preventDefault();
    HistoryStrHistoryViewExport(this.str_histories, "json");
  },
  "click #form-close-button": function(e, t) {
    e.preventDefault();

    Router.go("history", {});
  }


});

Template.HistoryStrHistoryView.helpers({

  "insertButtonClass": function() {
    return Histories.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
  },

  "isEmpty": function() {
    return !this.str_histories || this.str_histories.count() == 0;
  },
  "isNotEmpty": function() {
    return this.str_histories && this.str_histories.count() > 0;
  },
  "isNotFound": function() {
    return this.str_histories && pageSession.get("HistoryStrHistoryViewSearchString") && HistoryStrHistoryViewItems(this.str_histories).length == 0;
  },
  "searchString": function() {
    return pageSession.get("HistoryStrHistoryViewSearchString");
  },
  "viewAsTable": function() {
    return pageSession.get("HistoryStrHistoryViewStyle") == "table";
  },
  "viewAsList": function() {
    return pageSession.get("HistoryStrHistoryViewStyle") == "list";
  },
  "viewAsGallery": function() {
    return pageSession.get("HistoryStrHistoryViewStyle") == "gallery";
  }


});


Template.HistoryStrHistoryViewTable.rendered = function() {

};

Template.HistoryStrHistoryViewTable.events({
  "click .th-sortable": function(e, t) {
    e.preventDefault();
    var oldSortBy = pageSession.get("HistoryStrHistoryViewSortBy");
    var newSortBy = $(e.target).attr("data-sort");

    pageSession.set("HistoryStrHistoryViewSortBy", newSortBy);
    if (oldSortBy == newSortBy) {
      var sortAscending = pageSession.get("HistoryStrHistoryViewSortAscending") || false;
      pageSession.set("HistoryStrHistoryViewSortAscending", !sortAscending);
    } else {
      pageSession.set("HistoryStrHistoryViewSortAscending", true);
    }
  }
});

Template.HistoryStrHistoryViewTable.helpers({
  "tableItems": function() {
    return HistoryStrHistoryViewItems(this.str_histories);
  }
});


Template.HistoryStrHistoryViewTableItems.rendered = function() {

};

Template.HistoryStrHistoryViewTableItems.events({
  "click td": function(e, t) {
    e.preventDefault();

    Router.go("history.str_history.details", {historyId: this._id, activeId: this.activeId});
    return false;
  },

  "click .inline-checkbox": function(e, t) {
    e.preventDefault();

    if (!this || !this._id) return false;

    var fieldName = $(e.currentTarget).attr("data-field");
    if (!fieldName) return false;

    var values = {};
    values[fieldName] = !this[fieldName];

    Histories.update({ _id: this._id }, { $set: values });

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
            Histories.remove({ _id: me._id });
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

Template.HistoryStrHistoryViewTableItems.helpers({
  "checked": function(value) {
    return value ? "checked" : "" },
  "editButtonClass": function() {
    return Histories.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
  },

  "deleteButtonClass": function() {
    return Histories.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
  }
});
