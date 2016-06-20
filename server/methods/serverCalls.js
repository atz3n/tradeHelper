// import{Exchange} from '../trading/exchanges/ExXXX.js';


var exchange = {};

Meteor.methods({
  create: function(){

  },

  setConfig: function(config){
    exchange.setConfig(config);
  },

  getConfig: function(){
    return exchange.getConfig();
  },

  getStatus: function(){
    return exchange.getStatus();
  },

  getInfo: function(){
    return exchange.getInfo();
  },

  getPairUnits: function(){
    return exchange.getPairUnits();
  },

  getAmount: function(){
    return exchange.getAmount;
  },

  getPrice: function(){
    return exchange.getPrice();
  },

  getActionPrice: function(){
    return exchange.getActionPrice();
  },

  update: function(){
    return exchange.update();
  },

  sell: function(){
    return exchange.sell();
  },

  buy: function(){
    return exchange.buy();
  },

  getInstInfo: function(){
    return exchange.getInstInfo();
  }
});
