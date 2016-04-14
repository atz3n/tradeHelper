import { KrakenApi } from '../../api/KrakenApi.js'
// import '../../tools/globalData.js';


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

var _kClnt = new KrakenApi();


/***********************************************************************
  Class
 ***********************************************************************/

export function KrakenPlatform() {

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/
  
  var _config = Object.assign({}, KrakenPlatform.ConfigDefault);


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/
   
  /***********************************************************************
    Public Instance Function
   ***********************************************************************/


  /**
   * [update description]
   * @return {[type]} [description]
   */
  this.update = function() {
    var data = _kClnt.getTicker(_config.pair);

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
  this.setConfig = function(configuration) {
    _config = Object.assign({}, configuration);
    return true;
  }
};


/***********************************************************************
  Static Function
 ***********************************************************************/
