Meteor.subscribe("ex_krakens");
Meteor.subscribe("ex_test_datas");

Meteor.subscribe("pl_swings");
Meteor.subscribe("pl_dummys");

Meteor.subscribe("pluginbundles");


/***********************************************************************
  Exchanges
 ***********************************************************************/

this.getExchangeName = function(exId) {

	if(typeof ExKrakens.findOne({_id: exId}) !== 'undefined')
		return ExKrakens.findOne({_id: exId}).name;

	if(typeof ExTestDatas.findOne({_id: exId}) !== 'undefined')
		return ExTestDatas.findOne({_id: exId}).name;

	return '';
};


this.getExchanges = function() {
	var res = [];


	_.each(ExKrakens.find().fetch(),function(item){
		res.push({name: item.name, _id: item._id})
	});

	_.each(ExTestDatas.find().fetch(),function(item){
		res.push({name: item.name, _id: item._id})
	});

	res.sort(byName);
	return res;
};


/***********************************************************************
  Plugins
 ***********************************************************************/

this.getPluginName = function(plId) {

	if(typeof PlSwings.findOne({_id: plId}) !== 'undefined')
		return PlSwings.findOne({_id: plId}).name;

	if(typeof PlDummys.findOne({_id: plId}) !== 'undefined')
		return PlDummys.findOne({_id: plId}).name;

	return '';
};


this.getPlugins = function() {
	var res = [];


	_.each(PlSwings.find().fetch(),function(item){
		res.push({name: item.name, _id: item._id})
	});

	_.each(PlDummys.find().fetch(),function(item){
		res.push({name: item.name, _id: item._id})
	});

	res.sort(byName);
	return res;
};


/***********************************************************************
  Plugin Bundles
 ***********************************************************************/

this.getPluginBundleName = function(plBuId) {

	if(typeof PluginBundles.findOne({_id: plBuId}) !== 'undefined')
		return PluginBundles.findOne({_id: plBuId}).name;

	return '';
};


this.getPluginBundles = function() {
	var res = [];


	_.each(PluginBundles.find().fetch(),function(item){
		res.push({name: item.name, _id: item._id})
	});

	res.sort(byName);
	return res;
};




/***********************************************************************
  Local Function
 ***********************************************************************/

var byName = function(a,b) {
  if (a.name < b.name)
    return -1;
  else if (a.name > b.name)
    return 1;
  else 
    return 0;
}
