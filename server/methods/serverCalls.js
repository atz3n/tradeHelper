import{ExKraken} from '../trading/exchanges/ExKraken.js';


var exchange = {};

Meteor.methods({
  create: function(){
    exchange = new ExKraken();
    console.log('create');
  },

  setConfig: function(config){
    console.log(config)
    exchange.setConfig(config);
    console.log('setConfig');
  },

  getConfig: function(){
    return exchange.getConfig();
  },

  getStatus: function(){
    return exchange.getStatus();
  },

  getInfo: function(){
    console.log('getInfo')
    return exchange.getInfo();
  },

  getPairUnits: function(){
    return exchange.getPairUnits();
  },

  getVolume: function(){
    console.log('getVolume')
    return exchange.getVolume();
  },

  getPrice: function(){
    return exchange.getPrice();
  },

  getActionPrice: function(){
    return exchange.getActionPrice();
  },

  update: function(){
    console.log('update');
    return exchange.update();
  },

  sell: function(){
    return exchange.sell();
  },

  buy: function(){
    console.log('buy');
    console.log(exchange.buy())
    return true;
  },

  getInstInfo: function(){
    return exchange.getInstInfo();
  },

  getTradePairInfos: function() {
    console.log('getTradePairInfos')
    return ExKraken.getTradePairInfos();
  }
});
