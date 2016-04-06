import '../api/krakenApi.js';
import '../api/serverCallbacks.js'
import '../tools/scheduler.js';



Meteor.startup(() => {
  // code to run on server at startup
  SyncedCron.start();
});