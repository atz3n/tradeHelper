Meteor.subscribe("ex_krakens");
Meteor.subscribe("ex_test_datas");

Meteor.subscribe("pl_swings");
Meteor.subscribe("pl_dummys");

Meteor.subscribe("pluginbundles");

Meteor.subscribe("strategies");


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


      /* PlSwing */
      var plugin = PlSwings.find({ _id: bundlePlugins[j].plugin }).fetch()[0];
      if (typeof plugin !== "undefined") {
        if (enabled) PlSwings.update({ _id: plugin._id }, { $set: { actives: plugin.actives + 1 } });
        else if (plugin.actives >= 1) PlSwings.update({ _id: plugin._id }, { $set: { actives: plugin.actives - 1 } });
      }

      /* PlDummy */
      if (typeof plugin === "undefined") {
        plugin = PlDummys.find({ _id: bundlePlugins[j].plugin }).fetch()[0];
        if (typeof plugin !== "undefined") {
          if (enabled) PlDummys.update({ _id: plugin._id }, { $set: { actives: plugin.actives + 1 } });
          else if (plugin.actives >= 1) PlDummys.update({ _id: plugin._id }, { $set: { actives: plugin.actives - 1 } });
        }
      }


      /* exchanges */
      var exchange = plugin.exchange;
      if (typeof exchange !== "undefined") {


        /* ExKraken */
        var tempEx = ExKrakens.find({ _id: exchange }).fetch()[0];
        if (typeof tempEx !== "undefined") {
          if (enabled) ExKrakens.update({ _id: tempEx._id }, { $set: { actives: tempEx.actives + 1 } });
          else if (tempEx.actives >= 1) ExKrakens.update({ _id: tempEx._id }, { $set: { actives: tempEx.actives - 1 } });
        }

        /* ExTestDatas */
        if (typeof tempEx === "undefined") {
          tempEx = ExTestDatas.find({ _id: exchange }).fetch()[0];
          if (typeof tempEx !== "undefined") {
            if (enabled) ExTestDatas.update({ _id: tempEx._id }, { $set: { actives: tempEx.actives + 1 } });
            else if (tempEx.actives >= 1) ExTestDatas.update({ _id: tempEx._id }, { $set: { actives: tempEx.actives - 1 } });
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

  if (typeof ExKrakens.findOne({ _id: exId }) !== 'undefined')
    return ExKrakens.findOne({ _id: exId }).name;

  if (typeof ExTestDatas.findOne({ _id: exId }) !== 'undefined')
    return ExTestDatas.findOne({ _id: exId }).name;

  return '';
};


this.getExchanges = function() {
  var res = [];


  _.each(ExKrakens.find().fetch(), function(item) {
    res.push({ name: item.name, _id: item._id })
  });

  _.each(ExTestDatas.find().fetch(), function(item) {
    res.push({ name: item.name, _id: item._id })
  });

  res.sort(byName);
  return res;
};


/*++++++++++ Plugins ++++++++++*/

this.getPluginName = function(plId) {

  if (typeof PlSwings.findOne({ _id: plId }) !== 'undefined')
    return PlSwings.findOne({ _id: plId }).name;

  if (typeof PlDummys.findOne({ _id: plId }) !== 'undefined')
    return PlDummys.findOne({ _id: plId }).name;

  return '';
};


this.getPlugins = function() {
  var res = [];


  _.each(PlSwings.find().fetch(), function(item) {
    res.push({ name: item.name, _id: item._id })
  });

  _.each(PlDummys.find().fetch(), function(item) {
    res.push({ name: item.name, _id: item._id })
  });

  res.sort(byName);
  return res;
};


/*++++++++++ Plugin Bundles ++++++++++*/

this.getPluginBundleName = function(plBuId) {

  if (typeof PluginBundles.findOne({ _id: plBuId }) !== 'undefined')
    return PluginBundles.findOne({ _id: plBuId }).name;

  return '';
};


this.getPluginBundles = function() {
  var res = [];


  _.each(PluginBundles.find().fetch(), function(item) {
    res.push({ name: item.name, _id: item._id })
  });

  res.sort(byName);
  return res;
};


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
