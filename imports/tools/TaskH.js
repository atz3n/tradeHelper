// import { Instance } from '../dir/example.js';
// import './example.js';


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

// ClassName.Variable = 'Value';


/***********************************************************************
  private Static Variable
 ***********************************************************************/

// var variable = 'Value';


/***********************************************************************
  Public Static Function
 ***********************************************************************/
TaskH.TestFunc = function(){
	return test();
}

/***********************************************************************
  Private Static Function
 ***********************************************************************/
var test = function(){
	return 'it works';
}

/***********************************************************************
  Class
 ***********************************************************************/

export function TaskH() {

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/
  
  // var variable = 'Value';


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/
   
   // this.Variable = 'Value'; 


  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  // var functionName = function(param) {
  //   return 'Value';
  // }
  

  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  // this.functionName = function(param) {
  //   return 'Value';
  // }


}








// import './globalData.js';
// import { KrakenPlatform } from './krakenPlatform.js';


// Data = new Mongo.Collection('data');

// export var counterServer = 0;


// var kPl = new KrakenPlatform();
// var kPl2 = new KrakenPlatform();

// var kPlConf = Object.assign({}, KrakenPlatform.ConfigDefault);
// var kPl2Conf = Object.assign({}, KrakenPlatform.ConfigDefault);

// kPl2Conf.pair = KrakenPlatform.Pair.eth_eur;

// kPl.configure(kPlConf);
// kPl2.configure(kPl2Conf);


// if (Meteor.isServer) {
//   SyncedCron.add({
//     name: 'request Data',
//     schedule: function(parser) {
//       return parser.text('every 30 secs')
//         // return parser.text('every 1 mins')
//     },
//     job: function() {
//       counterServer++;
//       Meteor.ClientCall.apply(clientId, 'cltClbk_test', [counterServer], function(error, result) {})


//       kPl.locDB = 'bla';
//       kPl.update();
//       // kPl2.update();




//       // console.log(kClient.getTicker(KrakenClient.Pair.btc_eur));
//       // console.log(kClient.getRecentTrades(KrakenClient.Pair.btc_eur));
//       // console.log(kClient.getServerTime(KrakenClient.timeFormat.unix));
//     }
//   });
// }





