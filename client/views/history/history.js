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
  var combined = [];
  var bunch = [];

  
  while(true) {

    /* get bunch of histories from one acive Id */
    bunch = raw.filter(function(obj){
      return obj.activeId == raw[0].activeId;
    });

    /* sort bunch time ascending */
    bunch = bunch.sort(function(a,b){
      return moment(a.createdAt - b.createdAt);
    });
    

    var tmp = {};
    var startCap = [];
    var lastCap = [];
    var profitT = [];
    var profitP = [];

    tmp.strategyName = bunch[0].strategyName;
    tmp.strategyId = bunch[0].strategyId;
    tmp.activeId = bunch[0].activeId;
    tmp.profit = '';
    tmp.startCap = '';
    tmp.lastCap = '';
    tmp.ownerId = bunch[0].ownerId;


    /* get start Cap */
    _.each(bunch[0].exchanges, function(ex){
      startCap.push(ex.inPrice * ex.volume);
    });

    /* get last Cap */
    _.each(bunch[bunch.length - 1].exchanges, function(ex){
      lastCap.push(ex.outPrice * ex.volume);
    });
    
    /* get profits */
    for(j in bunch[0].exchanges) {
      profitT.push(cropFracDigits(lastCap[j] - startCap[j], 2));
      profitP.push(cropFracDigits(percentage(lastCap[j], startCap[j]), 2));
    }


    var tmpEx = {};
    for(l in bunch[0].exchanges) {
      tmpEx = bunch[0].exchanges[l];


      if(l != 0){
        tmp.startCap += ',rrr '; 
        tmp.lastCap += ', '; 
        tmp.profit += ', ';
      }

      tmp.startCap += cropFracDigits(startCap[l], 2);
      tmp.lastCap += cropFracDigits(lastCap[l], 2);

      if (tmpEx.units.base != '' && tmpEx.units.quote != '') {
        tmp.startCap += tmpEx.units.quote;
        tmp.lastCap += tmpEx.units.quote;
        tmp.profit += profitT[l] + tmpEx.units.quote + ' (' + profitP[l] + '%)';
      } else {
        tmp.profit += profitT[l] +  ' (' + profitP[l] + '%)';
      }
    }

    /* set run number */
    var tmp2 = combined.filter(function(obj){
      return obj.strategyId == tmp.strategyId;
    });

    if(tmp2.length !== 0) tmp.run = tmp2.length + 1;
    else tmp.run = 1;


    combined.push(tmp);
      
    for(i in bunch) raw.splice(raw.indexOf(bunch[i]), 1);
    if(raw.length === 0) break;
  }


  /* sort by name */
  combined = combined.sort(function(a, b) {
    if (a.strategyName < b.strategyName) return -1;
    else if (a.strategyName > b.strategyName) return 1;
    else return 0;
  });


  // filter
  var filtered = [];
  if (!searchString || searchString == "") {
    filtered = combined;
  } else {
    searchString = searchString.replace(".", "\\.");
    var regEx = new RegExp(searchString, "i");
    var searchFields = ["name", "date", "startCap", "lastCap", "profit"];
    filtered = _.filter(combined, function(item) {
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

    Router.go("history.str_history", {activeId: this.activeId});
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
            var tmp = Histories.find({activeId: me.activeId}).fetch();
            for(i in tmp) Histories.remove({ _id: tmp[i]._id });
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
