import { KrakenApi } from '../api/KrakenApi.js'
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
   
   this.locDB = 'undefined'; 


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/


  /**
   * [update description]
   * @return {[type]} [description]
   */
  this.update = function() {
    console.log(this.locDB);
    var data = kClnt.getTicker(config.pair);

    if(data === KrakenApi.ERROR_STRING){
    	return false;
    }

    console.log(data.p);
    return true;
  }


  /**
   * [configure description]
   * @param  {[type]} configuration [description]
   * @return {[type]}               [description]
   */
  this.configure = function(configuration) {
    config = Object.assign({}, configuration);
    return true;
  }
};


/***********************************************************************
  Static Function
 ***********************************************************************/
