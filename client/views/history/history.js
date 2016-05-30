var pageSession = new ReactiveDict();

Template.History.rendered = function() {
  Session.set('activePage', 'history');
};

Template.History.events({

});

Template.History.helpers({

});

var HistoryViewItems = function(cursor) {
  if (!cursor) {
    return [];
  }

  var searchString = pageSession.get("HistoryViewSearchString");
  var sortBy = pageSession.get("HistoryViewSortBy");
  var sortAscending = pageSession.get("HistoryViewSortAscending");
  if (typeof(sortAscending) == "undefined") sortAscending = true;

  var raw = cursor.fetch();


  for (i in raw) {

    raw[i].volumeIn = '';
    raw[i].profit = '';
    raw[i].volumeOut = '';

    for (j in raw[i].exchanges) {
      var tmp = raw[i].exchanges[j];

      if (j != 0) raw[i].volumeIn += ', ';
      if (j != 0) raw[i].profit += ', ';
      if (j != 0) raw[i].volumeOut += ', ';

      var volIn = tmp.inPrice * tmp.amount;
      var VolOut = tmp.outPrice * tmp.amount;

      raw[i].volumeIn += cropFracDigits(volIn, 3);
      raw[i].volumeOut += cropFracDigits(VolOut, 3);

      var tmpP = cropFracDigits(percentage(VolOut, volIn), 2);
      var tmpT = cropFracDigits(VolOut - volIn, 2);
      if (raw[i].position === 'short') {
      	tmpP *= -1;
        tmpT *= -1;
      }

      if (tmp.units.counter != '' && tmp.units.denominator != '') {
        raw[i].volumeIn += tmp.units.counter;
        raw[i].volumeOut += tmp.units.counter;
        raw[i].profit += tmpT + tmp.units.counter + ' (' + tmpP + '%)';
      } else {
        raw[i].profit += tmpT + ' (' + tmpP + '%)';
      }
    }
  }


  // filter
  var filtered = [];
  if (!searchString || searchString == "") {
    filtered = raw;
  } else {
    searchString = searchString.replace(".", "\\.");
    var regEx = new RegExp(searchString, "i");
    var searchFields = ["name", "date", "volumeIn", "volumeOut", "profit", "position"];
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

var HistoryViewExport = function(cursor, fileType) {
  var data = HistoryViewItems(cursor);
  var exportFields = [];

  var str = convertArrayOfObjects(data, exportFields, fileType);

  var filename = "export." + fileType;

  downloadLocalResource(str, filename, "application/octet-stream");
}


Template.HistoryView.rendered = function() {
  pageSession.set("HistoryViewStyle", "table");

};

Template.HistoryView.events({
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
        pageSession.set("HistoryViewSearchString", searchString);
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
          pageSession.set("HistoryViewSearchString", searchString);
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
          pageSession.set("HistoryViewSearchString", "");
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
    HistoryViewExport(this.histories, "csv");
  },

  "click #dataview-export-csv": function(e, t) {
    e.preventDefault();
    HistoryViewExport(this.histories, "csv");
  },

  "click #dataview-export-tsv": function(e, t) {
    e.preventDefault();
    HistoryViewExport(this.histories, "tsv");
  },

  "click #dataview-export-json": function(e, t) {
    e.preventDefault();
    HistoryViewExport(this.histories, "json");
  }


});

Template.HistoryView.helpers({

  "insertButtonClass": function() {
    return Histories.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
  },

  "isEmpty": function() {
    return !this.histories || this.histories.count() == 0;
  },
  "isNotEmpty": function() {
    return this.histories && this.histories.count() > 0;
  },
  "isNotFound": function() {
    return this.histories && pageSession.get("HistoryViewSearchString") && HistoryViewItems(this.histories).length == 0;
  },
  "searchString": function() {
    return pageSession.get("HistoryViewSearchString");
  },
  "viewAsTable": function() {
    return pageSession.get("HistoryViewStyle") == "table";
  },
  "viewAsList": function() {
    return pageSession.get("HistoryViewStyle") == "list";
  },
  "viewAsGallery": function() {
    return pageSession.get("HistoryViewStyle") == "gallery";
  }


});


Template.HistoryViewTable.rendered = function() {

};

Template.HistoryViewTable.events({
  "click .th-sortable": function(e, t) {
    e.preventDefault();
    var oldSortBy = pageSession.get("HistoryViewSortBy");
    var newSortBy = $(e.target).attr("data-sort");

    pageSession.set("HistoryViewSortBy", newSortBy);
    if (oldSortBy == newSortBy) {
      var sortAscending = pageSession.get("HistoryViewSortAscending") || false;
      pageSession.set("HistoryViewSortAscending", !sortAscending);
    } else {
      pageSession.set("HistoryViewSortAscending", true);
    }
  }
});

Template.HistoryViewTable.helpers({
  "tableItems": function() {
    return HistoryViewItems(this.histories);
  }
});


Template.HistoryViewTableItems.rendered = function() {

};

Template.HistoryViewTableItems.events({
  "click td": function(e, t) {
    e.preventDefault();

    Router.go("history.details", { historyId: this._id });
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

Template.HistoryViewTableItems.helpers({
  "checked": function(value) {
    return value ? "checked" : "" },
  "editButtonClass": function() {
    return Histories.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
  },

  "deleteButtonClass": function() {
    return Histories.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
  }
});
