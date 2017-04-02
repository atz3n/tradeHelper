import { InstHandler } from './lib/InstHandler.js';


/***********************************************************************
  Subscribe data bases
 ***********************************************************************/

Meteor.subscribe("pluginbundles");
Meteor.subscribe("strategies");


/* Exchanges */
Meteor.subscribe("ex_krakens");
Meteor.subscribe("ex_test_datas");


/* Plugins */
Meteor.subscribe("pl_stop_loss_outes");
Meteor.subscribe("pl_take_profit_outs");
Meteor.subscribe("pl_trailing_stop_ins");
Meteor.subscribe("pl_trailing_stop_outs");
Meteor.subscribe("pl_dummies");
Meteor.subscribe("pl_profit_line_stop_out_outs");


/***********************************************************************
  Set db handler
 ***********************************************************************/

var pluginHandler = new InstHandler();
var exchangeHandler = new InstHandler();


/* Plugins */
pluginHandler.setObject('PlStopLossOutes', PlStopLossOutes);
pluginHandler.setObject('PlTakeProfitOuts', PlTakeProfitOuts);
pluginHandler.setObject('PlTrailingStopIns', PlTrailingStopIns);
pluginHandler.setObject('PlTrailingStopOuts', PlTrailingStopOuts);
pluginHandler.setObject('PlDummies', PlDummies);
pluginHandler.setObject('PlProfitLineStopOuts', PlProfitLineStopOuts);


/* Exchanges */
exchangeHandler.setObject('ExTestDatas', ExTestDatas);
exchangeHandler.setObject('ExKrakens', ExKrakens);


/***********************************************************************
  Getter
 ***********************************************************************/

/*++++++++++ Exchanges ++++++++++*/

this.getExchangeName = function(exId) {

  for (var i = 0; i < exchangeHandler.getObjectsArray().length; i++) {
    var exchange = exchangeHandler.getObjectByIdx(i).findOne({ _id: exId });
    if (typeof exchange !== 'undefined') return exchange.name;
  }

  return '';
}


this.getExchanges = function() {
  var res = [];

  for (var i = 0; i < exchangeHandler.getObjectsArray().length; i++) {
    _.each(exchangeHandler.getObjectByIdx(i).find().fetch(), function(item) {
      res.push({ name: item.name, _id: item._id })
    });
  }

  res.sort(byName);
  return res;
}


/*++++++++++ Plugins ++++++++++*/

this.getPluginName = function(plId) {

  for (var i = 0; i < pluginHandler.getObjectsArray().length; i++) {
    var plugin = pluginHandler.getObjectByIdx(i).findOne({ _id: plId });
    if (typeof plugin !== 'undefined') return plugin.name;
  }

  return '';
}


this.getPlugins = function() {
  var res = [];


  for (var i = 0; i < pluginHandler.getObjectsArray().length; i++) {
    _.each(pluginHandler.getObjectByIdx(i).find().fetch(), function(item) {
      res.push({ name: item.name, _id: item._id })
    });
  }

  res.sort(byName);
  return res;
}


/***********************************************************************
  Local Function
 ***********************************************************************/

var byName = function(a, b) {
  if (a.name < b.name)
    return -1;
  else if (a.name > b.name)
    return 1;
  else
    return 0;
}
