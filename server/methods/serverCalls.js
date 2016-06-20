// import{Exchange} from '../trading/exchanges/ExXXX.js';




Meteor.methods({
  setConfig: function(config){

  },

  getConfig: function(){
    return 'config';
  },

  getStatus: function(){

    return 'status';
  },

  getInfo: function(){

    return 'info';
  },

  getPairUnits: function(){

    return 'pairUnit';
  },

  getAmount: function(){

    return 'amount';
  },

  getPrice: function(){

    return 'price';
  },

  getActionPrice: function(){

    return 'actionPrice';
  },

  update: function(){

    return 'update';
  },

  sell: function(){

    return 'sell';
  },

  buy: function(){

    return 'buy';
  },

  getInstInfo: function(){

    return 'instInfo';
  }
});
