import '../api/clientCallbacks.js';
import '../tools/system/globalData.js';
import '../ui/body.js';


Meteor.startup(() => {
  // code to run on client at startup
  Meteor.ClientCall.setClientId(clientId);
});