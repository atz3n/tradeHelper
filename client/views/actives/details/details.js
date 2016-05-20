var pageSession = new ReactiveDict();

Template.ActivesDetails.rendered = function() {

};

Template.ActivesDetails.events({

});

Template.ActivesDetails.helpers({

});


var processActiveData = function(data){

  var pData = {};
  var cnt = 0;

  pData.strategyName = data.strategyName;
  pData.state = data.state;
  pData.position = data.position;

  pData.bundles = new Array(data.bundles.length);

  for(var i = 0 ; i < data.bundles.length ; i++){
    pData.bundles[i] = {};
    pData.bundles[i].name = data.bundles[i].name;
    pData.bundles[i].plugins = new Array(data.bundles[i].plugins.length);

    for(var j = 0 ; j < data.bundles[i].plugins.length ; j++){
      pData.bundles[i].plugins[j] = {};

      for(var k = 0 ; k < data.plugins.length ; k++){
        if(data.bundles[i].plugins[j].pId === data.plugins[k].instInfo.id){
           pData.bundles[i].plugins[j] = Object.assign({}, data.plugins[k]);
        }
      }
      pData.bundles[i].plugins[j].num = cnt;
      cnt++;

      for(var k = 0 ; k < data.exchanges.length ; k++){
        if(data.bundles[i].plugins[j].eId === data.exchanges[k].instInfo.id){
           pData.bundles[i].plugins[j].exchange = Object.assign({}, data.exchanges[k]);
        }
      }
    }
  }

  return  pData;
}



var setPluginSessionVar = function(data, state){
  var cnt = 0;
  for(var i = 0 ; i < data.bundles.length ; i++){
    for(var j = 0 ; j < data.bundles[i].plugins.length ; j++){
      pageSession.set('showPl' + cnt, state);
      cnt ++;
    }
  }
}



Template.ActivesDetailsDetailsForm.rendered = function() {

  pageSession.set("activesDetailsDetailsFormInfoMessage", "");
  pageSession.set("activesDetailsDetailsFormErrorMessage", "");
  pageSession.set('showBundles', false);
  setPluginSessionVar(this.data.active_data, false);

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
  "click #form-bundle-button": function(e, t) {
    e.preventDefault();
    
    pageSession.set('showBundles', !pageSession.get('showBundles'));
  },
  "click #form-collapse-button": function(e, t) {
    e.preventDefault();

    setPluginSessionVar(this.active_data, false);
  },
  "click #form-expand-button": function(e, t) {
    e.preventDefault();
    
    setPluginSessionVar(this.active_data, true);
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


    if (documentArray(this.strategies_active, strId).paused) {
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
  "activeData": function() {
    return processActiveData(this.active_data);
  },
  "showBundles": function() {
    return pageSession.get('showBundles');
  },
  "strategyPaused": function() {
    if (documentArray(this.strategies_active, this.params.strategyId).paused)
      return true;
    else
      return false;
  }
});


Template.ActivesDetailsDetailsFormPlugins.rendered = function() {

};

Template.ActivesDetailsDetailsFormPlugins.events({
  "click #plugin-button": function(e, t) {
    e.preventDefault();

    pageSession.set('showPl' + this.num, !pageSession.get('showPl' + this.num));
  }
});

Template.ActivesDetailsDetailsFormPlugins.helpers({
"showPlugin": function(){
  return pageSession.get('showPl' + this.num);
}
});
