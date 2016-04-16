import './startup';

// import './globalData.js';
import { SchM } from '../imports/tools/SchM.js';
import { KrakenPlatform } from '../imports/trading/platforms/KrakenPlatform.js';
import { Swing } from '../imports/trading/indicators/Swing.js'
import { TestData } from '../imports/testing/TestData.js';







// var kPl = new KrakenPlatform();
// var kPl2 = new KrakenPlatform();

// var kPlConf = Object.assign({}, KrakenPlatform.ConfigDefault);
// var kPl2Conf = Object.assign({}, KrakenPlatform.ConfigDefault);

// kPl2Conf.pair = KrakenPlatform.Pair.eth_eur;

// kPl.setConfig(kPlConf);
// kPl2.setConfig(kPl2Conf);


var testData = new TestData();
var swing = new Swing(logger);

// testData.setCounter(90);

swing.setBuyNotifyFunc(buyNotiFunc);
swing.setSellNotifyFunc(sellNotiFunc);
swing.start(testData.getSin());
logger.info('Current: ' + swing.getData().currentVal);
logger.info('Frozen : ' + swing.getData().frozenVal);
logger.info('Top    : ' + swing.getData().topVal);
logger.info('Bottom : ' + swing.getData().bottomVal);
logger.info('-------------------------------------');



function sellNotiFunc() {
  logger.info('selling');
  swing.sold();
  
  /* restart */
  if(swing.getStatus() === 'out')
    swing.start(testData.getSin());
}


function buyNotiFunc() {
  logger.info('buying');
 
  swing.bought();
 /* restart */
  if(swing.getStatus() === 'out')
    swing.start(testData.getSin());
}






function cyclicFunction1() {
  // kPl.update();
  counterServer++;
  // logger.info(counterServer);
  Meteor.ClientCall.apply(clientId, 'cltClbk_test', [counterServer], function(error, result) {});
  // console.log('func1 called!!!');
}

function cyclicFunction2() {
  if (testData.getCounter() <= 360) {
    testData.update();
    swing.update(testData.getSin());
    logger.info('Current: ' + swing.getData().currentVal);
    logger.info('Frozen : ' + swing.getData().frozenVal);
    logger.info('Top    : ' + swing.getData().topVal);
    logger.info('Bottom : ' + swing.getData().bottomVal);
    logger.info('-------------------------------------');
  } else {
    SchM.stopSchedules();
  }
}


// SchM.createSchedule(scheduleIds.func1, 'every 10 secs', cyclicFunction1);
SchM.createSchedule(scheduleIds.func2, 'every 1 secs', cyclicFunction2);


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
