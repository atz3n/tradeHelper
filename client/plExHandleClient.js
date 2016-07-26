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
Meteor.subscribe("pl_swings");
Meteor.subscribe("pl_dummys");


/***********************************************************************
  Set db handler
 ***********************************************************************/

var pluginHandler = new InstHandler();
var exchangeHandler = new InstHandler();


/* Plugins */
pluginHandler.setObject('PlSwings', PlSwings);
pluginHandler.setObject('PlDummys', PlDummys);


/* Exchanges */
exchangeHandler.setObject('ExTestDatas', ExTestDatas);
exchangeHandler.setObject('ExKrakens', ExKrakens);


/***********************************************************************
  Enable/Disable Active state
 ***********************************************************************/

this.setActiveState = function(strId, enabled) {

  /* strategy */
  var strategy = Strategies.findOne({ _id: strId });
  Strategies.update({ _id: strId }, { $set: { active: enabled } });
  Strategies.update({ _id: strId }, { $set: { paused: false } });

  /* plugin bundles */
  var bundles = strategy.pluginBundles;
  for (i in bundles) {

    bundles[i] = PluginBundles.find({ _id: bundles[i].bundle }).fetch()[0];
    if (enabled) PluginBundles.update({ _id: bundles[i]._id }, { $set: { actives: bundles[i].actives + 1 } });
    else if (bundles[i].actives >= 1) PluginBundles.update({ _id: bundles[i]._id }, { $set: { actives: bundles[i].actives - 1 } });


    /* bundle plugins */
    var bundlePlugins = bundles[i].bundlePlugins;
    for (j in bundlePlugins) {


      /* plugins */
      for (let k = 0; k < pluginHandler.getObjectsArray().length; k++) {
        var pluginDb = pluginHandler.getObjectByIdx(k);
        var plugin = pluginDb.find({ _id: bundlePlugins[j].plugin }).fetch()[0];

        if (typeof plugin !== "undefined") {
          if (enabled) pluginDb.update({ _id: plugin._id }, { $set: { actives: plugin.actives + 1 } });
          else if (plugin.actives >= 1) pluginDb.update({ _id: plugin._id }, { $set: { actives: plugin.actives - 1 } });
          break;
        }
      }


      /* exchanges */
      var exchange = plugin.exchange;
      if (typeof exchange !== "undefined") {


        for (let k = 0; k < exchangeHandler.getObjectsArray().length; k++) {
          var exchangeDb = exchangeHandler.getObjectByIdx(k);
          var tempEx = exchangeDb.find({ _id: exchange }).fetch()[0];

          if (typeof tempEx !== "undefined") {
            if (enabled) exchangeDb.update({ _id: tempEx._id }, { $set: { actives: tempEx.actives + 1 } });
            else if (tempEx.actives >= 1) exchangeDb.update({ _id: tempEx._id }, { $set: { actives: tempEx.actives - 1 } });
            break;
          }
        }
      }
    }
  }
}


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


/*++++++++++ Plugin Bundles ++++++++++*/

this.getPluginBundleName = function(plBuId) {

  if (typeof PluginBundles.findOne({ _id: plBuId }) !== 'undefined')
    return PluginBundles.findOne({ _id: plBuId }).name;

  return '';
}


this.getPluginBundles = function() {
  var res = [];


  _.each(PluginBundles.find().fetch(), function(item) {
    res.push({ name: item.name, _id: item._id })
  });

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
