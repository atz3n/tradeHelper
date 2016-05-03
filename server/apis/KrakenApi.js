
/**
 * @description:
 * <Description>
 *
 * <Optional informations>
 * 
 * @author Atzen
 * @version 1.0
 * 
 * CHANGES:
 * 02-Jun-2015 : Initial version
 */


// import { Instance } from '../dir/example.js';
// import './example.js';


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

  var _config = {
    url_ServerTime: 'https://api.kraken.com/0/public/Time',
    url_Ticker: 'https://api.kraken.com/0/public/Ticker',
    url_Trades: 'https://api.kraken.com/0/public/Trades',
  };


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

KrakenApi.ERROR_STRING = 'KrakenApiError';


KrakenApi.timeFormat = {
  unix: 'unixtime',
  rcf: 'rfc1123'
};

KrakenApi.Pair = {
  eth_eur: 'XETHZEUR',
  eth_btc: 'XETHXXBT',
  eth_cad: 'XETHZCAD',
  eth_gbp: 'XETHZGBP',
  eth_jpy: 'XETHZJPY',
  eth_usd: 'XETHZUSD',
  ltc_cad: 'XLTCZCAD',
  ltc_eur: 'XLTCZEUR',
  ltc_usd: 'XLTCZUSD',
  btc_ltc: 'XXBTXLTC',
  btc_nmc: 'XXBTXNMC',
  btc_xdg: 'XXBTXXDG',
  btc_xlm: 'XXBTXXLM',
  btc_xrp: 'XXBTXXRP',
  btc_cad: 'XXBTZCAD',
  btc_eur: 'XXBTZEUR',
  btc_gbp: 'XXBTZGBP',
  btc_jpy: 'XXBTZJPY',
  btc_usd: 'XXBTZUSD'
};


/***********************************************************************
  Private Static Function
 ***********************************************************************/

/***********************************************************************
  Public Static Function
 ***********************************************************************/

  /**
   * [getRecentTrades description]
   * @param  {[type]} pair [description]
   * @return {[type]}      [description]
   */
  KrakenApi.getRecentTrades = function(pair) {
    try {
      return JSON.parse(HTTP.get(_config.url_Trades, { params: { pair: pair } }).content).result[pair];
    } catch (e) {
      console.log(e.message);
      return KrakenApi.ERROR_STRING;
    }
  }


  /**
   * [getTicker description]
   * @param  {[type]} pair [description]
   * @return {[type]}      [description]
   */
  KrakenApi.getTicker = function(pair) {
    try {
      return JSON.parse(HTTP.get(_config.url_Ticker, { params: { pair: pair } }).content).result[pair];
    } catch (e) {
      console.log(e.message);
      return KrakenApi.ERROR_STRING;
    }
  }


  /**
   * [getServerTime description]
   * @param  {[type]} format [description]
   * @return {[type]}        [description]
   */
  KrakenApi.getServerTime = function(format) {
    if (format !== KrakenApi.timeFormat.unix && format !== KrakenApi.timeFormat.rcf) {
      return KrakenApi.ERROR_STRING;
    }
    console.log(format);
    try {
      var jsonVal = JSON.parse(HTTP.get(_config.url_ServerTime, {}).content);

      var keys = Object.keys(jsonVal.result);
      for (var i = 0; i < keys.length; i++) {

        if (keys[i] == 'unixtime' && format == KrakenApi.timeFormat.unix) {
          return jsonVal.result[keys[i]];
        }

        if (keys[i] == 'rfc1123' && format == KrakenApi.timeFormat.rcf) {
          return jsonVal.result[keys[i]];
        }

      };

      return KrakenApi.ERROR_STRING;
    } catch (e) {
      console.log(e.message);
      return KrakenApi.ERROR_STRING;
    }
  }


/***********************************************************************
  Class
 ***********************************************************************/

export function KrakenApi() {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

}