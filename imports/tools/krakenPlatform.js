import { KrakenApi } from '../api/krakenApi.js'
import './globalData.js';


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

KrakenPlatform.ERROR_STRING = 'KrakenError';
KrakenPlatform.Pair = KrakenApi.Pair;

KrakenPlatform.ConfigDefault = {
  pair: KrakenPlatform.Pair.btc_eur,
}

/***********************************************************************
  private Static Variable
 ***********************************************************************/

var kClnt = new KrakenApi();


/***********************************************************************
  Class
 ***********************************************************************/

export function KrakenPlatform() {

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/
  
  var config = Object.assign({}, KrakenPlatform.ConfigDefault);


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/
   this.test = {pair: 'fsdf<'}


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  this.update = function() {
  	console.log(this.test);
    var data = kClnt.getTicker(config.pair);

    if(data === KrakenApi.ERROR_STRING){
    	return false;
    }

    console.log(data.p);
    return true;
  }


  this.configure = function(configuration) {
    config = Object.assign({}, configuration);
    return true;
  }
};


/***********************************************************************
  Static Function
 ***********************************************************************/
