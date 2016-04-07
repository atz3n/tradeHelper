import { HTTP } from 'meteor/http'


const krakenData = new Mongo.Collection('kData');
var ERROR_STRING = 'krakenApiError';


// if (Meteor.isServer) {

  Meteor.methods({

    /*++++++++++ getKrakenAssetPairs ++++++++++*/
    getKrakenAssetPairs: function() {
      this.unblock();
      try {
        return HTTP.get('https://api.kraken.com/0/public/AssetPairs', {}).content;
      } catch (e) {
        return ERROR_STRING;
      }
    },


    /*++++++++++ getKrakenTickerInfo ++++++++++*/
    getKrakenTickerInfo: function() {
      this.unblock();
      try {
        console.log(HTTP.get('https://api.kraken.com/0/public/Ticker', {params: {pair: "XBTCXLTC"}}).content);
      } catch (e) {
        return ERROR_STRING;
      }
    },



    /*++++++++++ getKrakenTimeStamp ++++++++++*/
    getKrakenTimeStamp: function(format) {
      this.unblock();
      var unixFormat = 'unix';
      var rcf1123Format = 'rfc';

      if (format !== unixFormat && format !== rcf1123Format) {
        return ERROR_STRING;
      }


      try {
        var jsonVal = JSON.parse(HTTP.get('https://api.kraken.com/0/public/Time', {}).content);

        var keys = Object.keys(jsonVal.result);
        for (var i = 0; i < keys.length; i++) {
          if(keys[i] == 'unixtime' && format == unixFormat) {
            return jsonVal.result[keys[i]];
          }

          if(keys[i] == 'rfc1123' && format == rcf1123Format) {
            return jsonVal.result[keys[i]];
          }
        };

        return ERROR_STRING;
      } catch (e) {
        return ERROR_STRING;
      }
    }
  });
// }
