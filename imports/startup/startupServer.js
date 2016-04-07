import '../api/KrakenApi.js';
import '../api/serverCallbacks.js'
import '../tools/TaskM.js';

import '../api/krakenApi__.js';



Meteor.startup(() => {
  // code to run on server at startup
  SyncedCron.start();
});