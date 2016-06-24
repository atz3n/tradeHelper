var pageSession = new ReactiveDict();

Template.HistoryDetails.rendered = function() {
  Session.set('activePage', 'history');
};

Template.HistoryDetails.events({

});

Template.HistoryDetails.helpers({

});


var processHistoryData = function(data){

  var pData = {};
  var cntPl = 0;
  var cntEx = 0;

  pData.strategyName = data.strategyName;
  pData.strategyId = data.strategyId;
  pData.position = data.position;
  pData.inTime = new Date (data.inTime);
  pData.outTime = new Date (data.outTime);
  pData.updateTime = data.strConfig.updateTime;
  pData.timeUnit = data.strConfig.timeUnit;
  pData.mode = data.strConfig.mode;
  
  pData.exchanges = new Array(data.exchanges.length);
  for(var i = 0 ; i < data.exchanges.length ; i++) {
   
    pData.exchanges[i] = {};
    pE = pData.exchanges[i];
    e = data.exchanges[i];

    pE.name = e.name;
    pE.type = e.instInfo.type;
    pE.inPrice = cropFracDigits(e.inPrice, 6);
    pE.outPrice = cropFracDigits(e.outPrice, 6);
    pE.volume = e.volume;
    pE.num = data._id +  cntEx;
    pE.config = Object.assign({}, e.config);
    cntEx++;

    var cosIn = pE.inPrice * pE.volume;
    var cosOut = pE.outPrice * pE.volume;

    pE.costIn = cropFracDigits(cosIn, 6);
    pE.costOut = cropFracDigits(cosOut, 6);
    pE.profitTot = cropFracDigits(cosOut - cosIn, 6);
    pE.profitPer = cropFracDigits(percentage(cosOut, cosIn), 4);
    pE.volume = cropFracDigits(pE.volume, 6);

    if(pData.position === 'short') {
      pE.profitTot *= -1;
      pE.profitPer *= -1;
    }

    pE.profitPer += '%';
    if (e.units.base != '' && e.units.quote != ''){
      pE.inPrice += ' ' + e.units.quote;
      pE.outPrice += ' ' + e.units.quote;
      pE.costIn += ' ' + e.units.quote;
      pE.costOut += ' ' + e.units.quote;
      pE.volume += ' ' + e.units.base;
      pE.profitTot += ' ' + e.units.quote;
    }
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



Template.HistoryDetailsDetailsForm.rendered = function() {

  pageSession.set("historyDetailsDetailsFormInfoMessage", "");
  pageSession.set("historyDetailsDetailsFormErrorMessage", "");
  pageSession.set('showBundles', false);
  pageSession.set('showExchanges', false);
  setPluginSessionVar(this.data.history, false);
  setExchangeSessionVar(this.data.history, false);

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

Template.HistoryDetailsDetailsForm.events({
  "submit": function(e, t) {
    e.preventDefault();
    pageSession.set("historyDetailsDetailsFormInfoMessage", "");
    pageSession.set("historyDetailsDetailsFormErrorMessage", "");

    var self = this;

    function submitAction(msg) {
      var historyDetailsDetailsFormMode = "read_only";
      if (!t.find("#form-cancel-button")) {
        switch (historyDetailsDetailsFormMode) {
          case "insert":
            {
              $(e.target)[0].reset();
            };
            break;

          case "update":
            {
              var message = msg || "Saved.";
              pageSession.set("historyDetailsDetailsFormInfoMessage", message);
            };
            break;
        }
      }

      /*SUBMIT_REDIRECT*/
    }

    function errorAction(msg) {
      msg = msg || "";
      var message = msg.message || msg || "Error.";
      pageSession.set("historyDetailsDetailsFormErrorMessage", message);
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

    Router.go("history", {});
  },
  "click #form-back-button": function(e, t) {
    e.preventDefault();

    Router.go("history", {});
  },
  "click #form-exchanges-button": function(e, t) {
    e.preventDefault();
    
    pageSession.set('showExchanges', !pageSession.get('showExchanges'));
  },
  "click #form-collapseExchanges-button": function(e, t) {
    e.preventDefault();

    setExchangeSessionVar(this.history, false);
    pageSession.set('showExchanges', false);
  },
  "click #form-expandExchanges-button": function(e, t) {
    e.preventDefault();

    setExchangeSessionVar(this.history, true);
    pageSession.set('showExchanges', true);
  },
  "click #form-bundle-button": function(e, t) {
    e.preventDefault();
    pageSession.set('showBundles', !pageSession.get('showBundles'));
  },
  "click #form-collapseBundles-button": function(e, t) {
    e.preventDefault();

    setPluginSessionVar(this.history, false);
    pageSession.set('showBundles', false);
  },
  "click #form-expandBundles-button": function(e, t) {
    e.preventDefault();
    setPluginSessionVar(this.history, true);
    pageSession.set('showBundles', true);
  }
});

Template.HistoryDetailsDetailsForm.helpers({
  "infoMessage": function() {
    return pageSession.get("historyDetailsDetailsFormInfoMessage");
  },
  "errorMessage": function() {
    return pageSession.get("historyDetailsDetailsFormErrorMessage");
  },
  "historyData": function() {
    return processHistoryData(this.history);
  },
  "showBundles": function() {
    return pageSession.get('showBundles');
  },
  "showExchanges": function() {
    return pageSession.get('showExchanges');
  }
});



Template.HistoryDetailsDetailsFormExchanges.rendered = function() {
};

Template.HistoryDetailsDetailsFormExchanges.events({
  "click #exchange-button": function(e, t) {
    e.preventDefault();

    pageSession.set('showEx' + this.num, !pageSession.get('showEx' + this.num));
  }
});

Template.HistoryDetailsDetailsFormExchanges.helpers({
  "showExchange": function(){
    return pageSession.get('showEx' + this.num);
  }
});



Template.HistoryDetailsDetailsFormPlugins.rendered = function() {
};

Template.HistoryDetailsDetailsFormPlugins.events({
  "click #plugin-button": function(e, t) {
    e.preventDefault();

    pageSession.set('showPl' + this.num, !pageSession.get('showPl' + this.num));
  }
});

Template.HistoryDetailsDetailsFormPlugins.helpers({
  "showPlugin": function(){
    return pageSession.get('showPl' + this.num);
  }
});
