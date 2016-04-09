import './globalData.js';
import { KrakenPlatform } from './KrakenPlatform.js';
import {SchM} from './SchM.js';



export var counterServer = 0;




var kPl = new KrakenPlatform();
var kPl2 = new KrakenPlatform();

var kPlConf = Object.assign({}, KrakenPlatform.ConfigDefault);
var kPl2Conf = Object.assign({}, KrakenPlatform.ConfigDefault);

kPl2Conf.pair = KrakenPlatform.Pair.eth_eur;

kPl.configure(kPlConf);
kPl2.configure(kPl2Conf);





function cyclicFunction1(){
  // kPl.update();
  counterServer++;
  Meteor.ClientCall.apply(clientId, 'cltClbk_test', [counterServer], function(error, result) {
  });
  console.log('func1 called!!!');
}

function cyclicFunction2(){
  console.log('func2 called!!!');
  // kPl2.update();
}


SchM.createSchedule(scheduleIds.func1, 'every 20 secs', cyclicFunction1);
SchM.createSchedule(scheduleIds.func2, 'every 30 secs', cyclicFunction2);
SchM.startSchedules();











// var kPl = new KrakenPlatform();
// var kPl2 = new KrakenPlatform();

// var kPlConf = Object.assign({}, KrakenPlatform.ConfigDefault);
// var kPl2Conf = Object.assign({}, KrakenPlatform.ConfigDefault);

// kPl2Conf.pair = KrakenPlatform.Pair.eth_eur;

// kPl.configure(kPlConf);
// kPl2.configure(kPl2Conf);

// var sch = new Schedule();





// if (Meteor.isServer) {
//   SyncedCron.add({
//     name: 'request Data',
//     schedule: function(parser) {
//       return parser.text('every 20 secs')
//         // return parser.text('every 1 mins')
//     },
//     job: function() {
//       counterServer++;
//       Meteor.ClientCall.apply(clientId, 'cltClbk_test', [counterServer], function(error, result) {
//       })

//       // console.log(TaskH.TestFunc());
//       // kPl.locDB = 'bla';
//       // kPl.update();
//       // kPl2.update();




//       // console.log(kClient.getTicker(KrakenClient.Pair.btc_eur));
//       // console.log(kClient.getRecentTrades(KrakenClient.Pair.btc_eur));
//       // console.log(kClient.getServerTime(KrakenClient.timeFormat.unix));
//     }
//   });
// }





