var pageSession = new ReactiveDict();

Template.ActivesDetails.rendered = function() {

};

Template.ActivesDetails.events({

});

Template.ActivesDetails.helpers({

});


var processActiveData = function(data){

  var pData = {};
  var cntPl = 0;
  var cntEx = 0;

  pData.strategyName = data.strategyName;
  pData.state = data.state;
  pData.position = data.position;


  pData.exchanges = new Array(data.exchanges.length);
  for(var i = 0 ; i < data.exchanges.length ; i++) {
   
    pData.exchanges[i] = {};
    pE = pData.exchanges[i];
    e = data.exchanges[i];

    pE.name = e.name;
    pE.type = e.instInfo.type;
    pE.price = cropFracDigits(e.price, 6);
    pE.num = data._id +  cntEx;
    cntEx++;


    if(pData.state === 'none'){
      pE.inPrice = '-';
      pE.amount = '-';
      pE.volume = '-';
      pE.winLoss = '-';
    }

    if(pData.state !== 'none'){
      pE.inPrice = e.inPrice;
      pE.amount = e.amount;

      var volIn = pE.inPrice * pE.amount;
      var volCur = pE.price * pE.amount;

      pE.volumeIn = cropFracDigits(volIn, 6);
      pE.volumeCur = cropFracDigits(volCur, 6);
      pE.winLoss = cropFracDigits(percentage(volCur, volIn), 6);

      if (e.units.counter != '' && e.units.denominator != ''){
          pE.volumeIn += ' ' + e.units.counter;
          pE.volumeCur += ' ' + e.units.counter;
      }
    }
    pE.price = cropFracDigits(pE.price, 6);
    if (e.units.counter != '' && e.units.denominator != '')
      pE.price += ' ' + e.units.counter + '/' + e.units.denominator;
  }

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

      pData.bundles[i].plugins[j].num = data._id + cntPl;
      cntPl++;

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
      pageSession.set('showPl' + data._id + cnt, state);
      cnt ++;
    }
  }
}

var setExchangeSessionVar = function(data, state){
  var cnt = 0;
  for(var i = 0 ; i < data.exchanges.length ; i++){
    pageSession.set('showEx' + data._id + cnt, state);
    cnt ++;
  }
}



Template.ActivesDetailsDetailsForm.rendered = function() {

  pageSession.set("activesDetailsDetailsFormInfoMessage", "");
  pageSession.set("activesDetailsDetailsFormErrorMessage", "");
  pageSession.set('showBundles', false);
  pageSession.set('showExchanges', false);
  setPluginSessionVar(this.data.active_data, false);
  setExchangeSessionVar(this.data.active_data, false);

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
  "click #form-exchanges-button": function(e, t) {
    e.preventDefault();
    
    pageSession.set('showExchanges', !pageSession.get('showExchanges'));
  },
  "click #form-collapseExchanges-button": function(e, t) {
    e.preventDefault();

    setExchangeSessionVar(this.active_data, false);
    pageSession.set('showExchanges', false);
  },
  "click #form-expandExchanges-button": function(e, t) {
    e.preventDefault();

    setExchangeSessionVar(this.active_data, true);
    pageSession.set('showExchanges', true);
  },
  "click #form-bundle-button": function(e, t) {
    e.preventDefault();
    pageSession.set('showBundles', !pageSession.get('showBundles'));
  },
  "click #form-collapseBundles-button": function(e, t) {
    e.preventDefault();

    setPluginSessionVar(this.active_data, false);
    pageSession.set('showBundles', false);
  },
  "click #form-expandBundles-button": function(e, t) {
    e.preventDefault();
    setPluginSessionVar(this.active_data, true);
    pageSession.set('showBundles', true);
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
  "showExchanges": function() {
    return pageSession.get('showExchanges');
  },
  "strategyPaused": function() {
    if (documentArray(this.strategies_active, this.params.strategyId).paused)
      return true;
    else
      return false;
  }
});



Template.ActivesDetailsDetailsFormExchanges.rendered = function() {
};

Template.ActivesDetailsDetailsFormExchanges.events({
  "click #exchange-button": function(e, t) {
    e.preventDefault();

    pageSession.set('showEx' + this.num, !pageSession.get('showEx' + this.num));
  }
});

Template.ActivesDetailsDetailsFormExchanges.helpers({
  "showExchange": function(){
    return pageSession.get('showEx' + this.num);
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
