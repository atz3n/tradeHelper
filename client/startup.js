
Meteor.startup(() => {
  // code to run on client at startup
  Meteor.ClientCall.setClientId(clientId);
});