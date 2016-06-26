import{ExKraken} from '../trading/exchanges/ExKraken.js';


var exchange = {};

Meteor.methods({
  create: function(){
    exchange = new ExKraken();
    console.log('create');
  },

  setConfig: function(config){
    console.log('setConfig');
    return exchange.setConfig(config);
  },

  getConfig: function(){
    console.log('getConfig');
    return exchange.getConfig();
  },

  getStatus: function(){
    console.log('getStatus');
    return exchange.getStatus();
  },

  getInfo: function(){
    console.log('getInfo')
    return exchange.getInfo();
  },

  getPairUnits: function(){
    console.log('getPairUnits');
    return exchange.getPairUnits();
  },

  getVolume: function(){
    console.log('getVolume')
    return exchange.getVolume();
  },

  getPrice: function(){
    console.log('getPrice')
    return exchange.getPrice();
  },

  getActionPrice: function(){
    console.log('getActionPrice')
    return exchange.getActionPrice();
  },

  update: function(){
    console.log('update');
    return exchange.update();
  },

  sell: function(){
    console.log('sell');
    return exchange.sell('long');
  },

  buy: function(){
    console.log('buy');
    return exchange.buy('long');
  },

  getInstInfo: function(){
    console.log('getInstInfo');
    return exchange.getInstInfo();
  },

  getTradePairInfos: function() {
    console.log('getTradePairInfos')
    return ExKraken.getTradePairInfos();
  }
});
