import { TimeFormat } from '../../../lib/TimeFormat.js';
var pageSession = new ReactiveDict();
var chart = '';

Template.ActivesDetails.rendered = function() {
  Session.set('activePage', 'actives');
};

Template.ActivesDetails.events({

});

Template.ActivesDetails.helpers({

});


var processActiveData = function(data) {
  pageSession.set('reacData', data);
  var pData = {};
  var cntPl = 0;
  var cntEx = 0;

  pData.strategyName = data.strategyName;
  pData.state = data.state;
  pData.position = data.position;
  pData.curTime = new Date(data.curTime[data.curTime.length - 1]);

  if (pData.position !== 'none') pData.inTime = new Date(data.inTime);
  else pData.inTime = '-'

  pData.exchanges = new Array(data.exchanges.length);
  for (var i = 0; i < data.exchanges.length; i++) {

    pData.exchanges[i] = {};
    pE = pData.exchanges[i];
    e = data.exchanges[i];

    pE.name = e.name;
    pE.type = e.instInfo.type;
    pE.price = cropFracDigits(e.price[e.price.length - 1], 6);
    pE.info = e.info;
    pE.num = data._id + cntEx;
    cntEx++;

    var exPageString = convertCamelCaseToUnderscore(e.instInfo.type);
    pE.link = "/exchanges/" + exPageString + "/" + "details_" + exPageString + "/" + e.instInfo.id;

    if (pData.position === 'none') {
      pE.inPrice = '-';
      pE.inTime = '-';
      pE.volume = '-';
      pE.costIn = '-';
      pE.costCur = '-';
      pE.profitPer = '-';
      pE.profitTot = '-';
    }

    if (pData.position !== 'none') {
      pE.inPrice = cropFracDigits(e.inPrice, 6);
      pE.volume = e.volume;

      var cosIn = pE.inPrice * pE.volume;
      var cosCur = pE.price * pE.volume;

      pE.costIn = cropFracDigits(cosIn, 6);
      pE.costCur = cropFracDigits(cosCur, 6);
      pE.profitPer = cropFracDigits(percentage(cosCur, cosIn), 4);
      pE.profitTot = cropFracDigits(cosCur - cosIn, 6);
      pE.volume = cropFracDigits(pE.volume, 6);

      if (pData.position === 'short') {
        pE.profitTot *= -1;
        pE.profitPer *= -1;
      }

      pE.profitPer += '%';
      if (e.units.base != '' && e.units.quote != '') {
        pE.costIn += ' ' + e.units.quote;
        pE.costCur += ' ' + e.units.quote;
        pE.inPrice += ' ' + e.units.quote;
        pE.volume += ' ' + e.units.base;
        pE.profitTot += ' ' + e.units.quote;
      }
    }

    pE.price = cropFracDigits(pE.price, 6);
    if (e.units.base != '' && e.units.quote != '')
      pE.price += ' ' + e.units.quote;
  }

  pData.bundles = new Array(data.bundles.length);

  for (var i = 0; i < data.bundles.length; i++) {
    pData.bundles[i] = {};
    pData.bundles[i].name = "Bundle " + (i + 1);
    pData.bundles[i].plugins = new Array(data.bundles[i].plugins.length);

    for (var j = 0; j < data.bundles[i].plugins.length; j++) {
      pData.bundles[i].plugins[j] = {};

      for (var k = 0; k < data.plugins.length; k++) {
        if (data.bundles[i].plugins[j].pId === data.plugins[k].instInfo.id) {
          pData.bundles[i].plugins[j] = Object.assign({}, data.plugins[k]);

          var plPageString = convertCamelCaseToUnderscore(data.plugins[k].instInfo.type);
          pData.bundles[i].plugins[j].link = "/plugins/" + plPageString + "/" + "details_" + plPageString + "/" + data.plugins[k].instInfo.id;
        }
      }

      pData.bundles[i].plugins[j].num = data._id + cntPl;
      cntPl++;

      for (var k = 0; k < data.exchanges.length; k++) {
        if (data.bundles[i].plugins[j].eId === data.exchanges[k].instInfo.id) {
          pData.bundles[i].plugins[j].exchange = Object.assign({}, data.exchanges[k]);
        }
      }
    }
  }
  return pData;
}

var gridEnabled = false;
var postloadChartFunc = function() {
  var aD = pageSession.get('reacData');

  if (!gridEnabled) {
    if (aD.position !== 'none') {
      chart.ygrids.remove();
      
      for (i in aD.exchanges) {
        var tmp = aD.exchanges[i];

        var label = tmp.name + ' in: ' + cropFracDigits(tmp.inPrice, 3);
        if (tmp.units.base != '' && tmp.units.quote != '') {
          label += ' ' +  tmp.units.quote;
        }

        chart.ygrids.add({
          value: tmp.inPrice,
          text: label,
          position: 'start'
        });
      }

      gridEnabled = true;
    }
  } else {
    if (aD.position === 'none') {
      chart.ygrids.remove();

      if (aD.exchanges[0].outPrice) {

        for (i in aD.exchanges) {
          var tmp = aD.exchanges[i];


          var label = tmp.name + ' out: ' + cropFracDigits(tmp.outPrice, 3);
          if (tmp.units.base != '' && tmp.units.quote != '') {
            label += ' ' + tmp.units.quote;
          }

          chart.ygrids.add({
            value: tmp.outPrice,
            text: label,
            position: 'start'
          });
        }
      }
      gridEnabled = false;
    }
  }
}

var setChartValues = function(self) {
  var aD = self.active_data;
  var timeUnit = self.strategy.timeUnit;
  var cols = [];
  var time = [];


  var time = ['x'];
  _.each(aD.curTime, function(d) {
    var tmp = '';
    var date = new Date(d);

    if (timeUnit === 'seconds') {
      tmp = TimeFormat.getHours(date) +
        ':' + TimeFormat.getMinutes(date) +
        ':' + TimeFormat.getSeconds(date);
    } else if (timeUnit === 'minutes') {
      tmp = TimeFormat.getDay(date) +
        ' ' + TimeFormat.getHours(date) +
        ':' + TimeFormat.getMinutes(date);
    } else if (timeUnit === 'hours') {
      tmp = TimeFormat.getMonth(date) +
        '-' + TimeFormat.getDay(date) +
        ' ' + TimeFormat.getHours(date);
    } else {
      tmp = TimeFormat.getYear(date) +
        '-' + TimeFormat.getMonth(date) +
        '-' + TimeFormat.getDay(date);
    }

    time.push(tmp);
  });
  cols.push(time);


  for (i in aD.exchanges) {
    var tmp = aD.exchanges[i];
    var col = [tmp.name];
    var inGrid = [];

    _.each(tmp.price, function(p) {
      col.push(cropFracDigits(p, 6));
    });
    cols.push(col);
  }


  var retVal = {
    data: {
      x: 'x',
      columns: cols,
      type: 'line'
    },
    // point: {
    // show: false
    // },
    // subchart: {
    //   show: true
    // },
    zoom: {
      enabled: true
    },
    axis: {
      x: {
        type: 'category',
        tick: {
          centered: true,
          culling: true,
          multiline: false
        }
      }
    },
    grid: {
      y: {
        show: false,
        lines: inGrid
      }
    }
  };

  Session.set('chartData', retVal);
}


var setPluginSessionVar = function(data, state) {
  var cnt = 0;
  for (var i = 0; i < data.bundles.length; i++) {
    for (var j = 0; j < data.bundles[i].plugins.length; j++) {
      pageSession.set('showPl' + data._id + cnt, state);
      cnt++;
    }
  }
}

var setExchangeSessionVar = function(data, state) {
  var cnt = 0;
  for (var i = 0; i < data.exchanges.length; i++) {
    pageSession.set('showEx' + data._id + cnt, state);
    cnt++;
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
var cnt = 0;
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
  "click #form-refresh-button": function(e, t) {
    e.preventDefault();
    var strId = this.params.strategyId;

    Session.set('data1', ['data1', 30, 200, 100, 400, cnt++]);
    Meteor.call('strategyRefresh', strId, function(e, r) {
      if (e) console.log(e);
    });
  },
  "click #form-reset-button": function(e, t) {
    e.preventDefault();
    var strId = this.params.strategyId;
    bootbox.dialog({
      message: "Reset Plugins? Are you sure?",
      title: "Plugins Reset",
      animate: false,
      buttons: {
        success: {
          label: "Yes",
          className: "btn-success",
          callback: function() {
            Meteor.call('strategyReset', strId, function(e, r) {
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


  },
  "click #form-buy-button": function(e, t) {
    e.preventDefault();
    var strId = this.params.strategyId;
    
    if (this.active_data.position !== 'long') {
      if (this.active_data.state === 'buying') {
        bootbox.dialog({
          message: "Stop? Are you sure?",
          title: "Stop Buying",
          animate: false,
          buttons: {
            success: {
              label: "Yes",
              className: "btn-success",
              callback: function() {
                Meteor.call('strategyStopTrade', strId, function(e, r) {
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
      }
      else if(this.active_data.state !== 'selling')
      {
        bootbox.dialog({
          message: "Buy? Are you sure?",
          title: "Buy",
          animate: false,
          buttons: {
            success: {
              label: "Yes",
              className: "btn-success",
              callback: function() {
                Meteor.call('strategyBuy', strId, function(e, r) {
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
      }
      else
      {
        bootbox.alert('Cannot buy while selling!');
      }
    } else {
      bootbox.alert('Already bought!');
    }
  },
  "click #form-sell-button": function(e, t) {
    e.preventDefault();
    var strId = this.params.strategyId;
    
    if(this.active_data.position !== 'short'){
      if (this.active_data.state === 'selling') {
        bootbox.dialog({
          message: "Stop? Are you sure?",
          title: "Stop Selling",
          animate: false,
          buttons: {
            success: {
              label: "Yes",
              className: "btn-success",
              callback: function() {
                Meteor.call('strategyStopTrade', strId, function(e, r) {
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
      }
      else if(this.active_data.state !== 'buying')
      {
        bootbox.dialog({
          message: "Sell? Are you sure?",
          title: "Sell",
          animate: false,
          buttons: {
            success: {
              label: "Yes",
              className: "btn-success",
              callback: function() {
                Meteor.call('strategySell', strId, function(e, r) {
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
      }
      else
      {
        bootbox.alert('Cannot sell while buying!');
      }
    } else {
      bootbox.alert('Already sold!')
    }
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
    if(this.active_data) setChartValues(this);
    Session.set('data1', ['data1', 30, 200, 100, 400, cnt++]);
    if(this.active_data) return processActiveData(this.active_data);
  },
  "strategyData": function() {
    return documentArray(this.strategies_active, this.params.strategyId);
  },
  "showBundles": function() {
    return pageSession.get('showBundles');
  },
  "showExchanges": function() {
    return pageSession.get('showExchanges');
  },
  "strategyPaused": function() {
    var tmp = documentArray(this.strategies_active, this.params.strategyId);
    if(tmp){
      if (tmp.paused)
        return true;
      else
        return false;
    }
  }
});



Template.ActivesDetailsDetailsFormExchanges.rendered = function() {};

Template.ActivesDetailsDetailsFormExchanges.events({
  "click #exchange-button": function(e, t) {
    e.preventDefault();

    pageSession.set('showEx' + this.num, !pageSession.get('showEx' + this.num));
  }
});

Template.ActivesDetailsDetailsFormExchanges.helpers({
  "showExchange": function() {
    return pageSession.get('showEx' + this.num);
  }
});



Template.ActivesDetailsDetailsFormPlugins.rendered = function() {};

Template.ActivesDetailsDetailsFormPlugins.events({
  "click #plugin-button": function(e, t) {
    e.preventDefault();

    pageSession.set('showPl' + this.num, !pageSession.get('showPl' + this.num));
  }
});

Template.ActivesDetailsDetailsFormPlugins.helpers({
  "showPlugin": function() {
    return pageSession.get('showPl' + this.num);
  }
});


Template.ActivesDetailsChartForm.rendered = function() {
  var self = this;
  var tmp = Session.get('chartData');
  tmp.bindto = this.find('.chart');

  chart = c3.generate(tmp)

  this.autorun(function(tracker) {
    chart.load(Session.get('chartData').data);
    postloadChartFunc();
  });
};

Template.ActivesDetailsChartForm.events({});

Template.ActivesDetailsChartForm.helpers({});
