var pageSession = new ReactiveDict();

Template.ActivesDetails.rendered = function() {

};

Template.ActivesDetails.events({

});

Template.ActivesDetails.helpers({

});

Template.ActivesDetailsDetailsForm.rendered = function() {
  pageSession.set("pluginBundlesCrudItems", this.data.strategy.pluginBundles || []);


  pageSession.set("activesDetailsDetailsFormInfoMessage", "");
  pageSession.set("activesDetailsDetailsFormErrorMessage", "");

  $(".input-group.date").each(function() {
    var format = $(this).find("input[type='text']").attr("data-format");

    if (format) {
      format = format.toLowerCase();
    } else {
      format = "mm/dd/yyyy";
    }

    $(this).datepicker({
      autoclose: true,
      todayHighlight: true,
      todayBtn: true,
      forceParse: false,
      keyboardNavigation: false,
      format: format
    });
  });

  $("input[type='file']").fileinput();
  $("select[data-role='tagsinput']").tagsinput();
  $(".bootstrap-tagsinput").addClass("form-control");
  $("input[autofocus]").focus();
};

Template.ActivesDetailsDetailsForm.events({
  "submit": function(e, t) {
    e.preventDefault();
    pageSession.set("activesDetailsDetailsFormInfoMessage", "");
    pageSession.set("activesDetailsDetailsFormErrorMessage", "");

    var self = this;

    function submitAction(msg) {
      var activesDetailsDetailsFormMode = "read_only";
      if (!t.find("#form-cancel-button")) {
        switch (activesDetailsDetailsFormMode) {
          case "insert":
            {
              $(e.target)[0].reset();
            };
            break;

          case "update":
            {
              var message = msg || "Saved.";
              pageSession.set("activesDetailsDetailsFormInfoMessage", message);
            };
            break;
        }
      }

      /*SUBMIT_REDIRECT*/
    }

    function errorAction(msg) {
      msg = msg || "";
      var message = msg.message || msg || "Error.";
      pageSession.set("activesDetailsDetailsFormErrorMessage", message);
    }

    validateForm(
      $(e.target),
      function(fieldName, fieldValue) {

      },
      function(msg) {

      },
      function(values) {



      }
    );

    return false;
  },
  "click #form-cancel-button": function(e, t) {
    e.preventDefault();



    /*CANCEL_REDIRECT*/
  },
  "click #form-close-button": function(e, t) {
    e.preventDefault();

    Router.go("actives", {});
  },
  "click #form-back-button": function(e, t) {
    e.preventDefault();

    Router.go("actives", {});
  },
  "click #form-stop-button": function(e, t) {
    e.preventDefault();
    var strId = this.params.strategyId;
    bootbox.dialog({
      message: "Stop? Are you sure?",
      title: "Stop",
      animate: false,
      buttons: {
        success: {
          label: "Yes",
          className: "btn-success",
          callback: function() {
            Meteor.call('strategyStop', strId, function(e, r) {
              if (e) console.log(e);
              else if (r) {
                Strategies.update({ _id: strId }, { $set: { active: false } });
                Strategies.update({ _id: strId }, { $set: { paused: false } });
                Router.go("actives", {});
              }
            });
          }
        },
        danger: {
          label: "No",
          className: "btn-default"
        }
      }
    });
  },
  "click #form-pausePlay-button": function(e, t) {
    e.preventDefault();
    var strId = this.params.strategyId;

    if (Strategies.findOne({ _id: strId }).paused) {
      Meteor.call('strategyStart', strId, function(e, r) {
        if (e) console.log(e);
        else if (r) Strategies.update({ _id: strId }, { $set: { paused: false } });
      });
    } else {
      Meteor.call('strategyPause', strId, function(e, r) {
        if (e) console.log(e);
        else if (r) Strategies.update({ _id: strId }, { $set: { paused: true } });
      });
    }
  },
  "click #form-buy-button": function(e, t) {
    e.preventDefault();
    var strId = this.params.strategyId;

    Meteor.call('strategyBuy', strId, function(e, r) {
      if (e) console.log(e);
    });
  },
  "click #form-sell-button": function(e, t) {
    e.preventDefault();
    var strId = this.params.strategyId;

    Meteor.call('strategySell', strId, function(e, r) {
      if (e) console.log(e);
    });
  }
});

Template.ActivesDetailsDetailsForm.helpers({
  "infoMessage": function() {
    return pageSession.get("activesDetailsDetailsFormInfoMessage");
  },
  "errorMessage": function() {
    return pageSession.get("activesDetailsDetailsFormErrorMessage");
  },
  "pluginBundlesCrudItems": function() {
    return pageSession.get("pluginBundlesCrudItems");
  },
  "strategyPaused": function() {
    if (Strategies.findOne({ _id: this.params.strategyId }).paused)
      return true;
    else
      return false;
  }
});
