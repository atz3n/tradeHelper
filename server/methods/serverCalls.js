import{ExKraken} from '../trading/exchanges/ExKraken.js';


var exchange = {};


var bFunc = function(instInfo, errObject){
  console.log('bought');
  console.log(instInfo);
  console.log(errObject);
  console.log('vol: ' + exchange.getVolume().result);
  console.log('tPrice: ' + exchange.getTradePrice().result);
}

var sFunc = function(instInfo, errObject){
  console.log('sold');
  console.log(instInfo);
  console.log(errObject);
  console.log('vol: ' + exchange.getVolume().result);
  console.log('tPrice: ' + exchange.getTradePrice().result);
}





Meteor.methods({
  create: function(){
    exchange = new ExKraken();
    console.log('create');
  },

  setConfig: function(config){
    console.log('setConfig');
    exchange.setBoughtNotifyFunc(bFunc);
    exchange.setSoldNotifyFunc(sFunc);
    return exchange.setConfig(config);
  },

  getConfig: function(){
    console.log('getConfig');
    return exchange.getConfig();
  },

  getStatus: function(){
    console.log('getStatus');
    var tmp = exchange.getStatus();
    console.log('continued');
    return tmp;
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

  getTradePrice: function(){
    console.log('getTradePrice')
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

  stopTrade: function(){
    console.log('stopTrade');
    return exchange.stopTrade();
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
