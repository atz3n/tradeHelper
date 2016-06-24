Meteor.subscribe("settings_first");
Meteor.subscribe("strategies");
Meteor.subscribe("active_datas");

// var ntfySnd = new buzz.sound('sounds/truck.ogg');
var ntfySnd = new buzz.sound('sounds/Electronic_Chime-KevanGC.mp3');
Meteor.ClientCall.methods({

  notification: function(infos) {

    /* browser notification dialog */
    if (Settings.findOne().enBrNtfctn) {
      var mode = Strategies.find({ _id: infos.strategyId }).fetch()[0].mode;
      var aData = ActiveDatas.findOne({ strategyId: infos.strategyId });
      bootbox.hideAll();


      var title = '';
      if (mode === 'manual') {
        title = aData.strategyName + ' ' + aData.state;
      }
      if (mode === 'semiAuto') {
        title = aData.strategyName + ' ' + aData.state;
      }
      if (mode === 'auto') {
        if (aData.state === 'in')
          title = aData.strategyName + ' ' + aData.position + ' ' + aData.state;
        else
          title = aData.strategyName + ' ' + aData.state;
      }

      var msg = "Price: ";

      for (k in aData.exchanges) {
        var tmp = aData.exchanges[k];
        if (k != 0) msg += ', ';
        msg += cropFracDigits(tmp.price[tmp.price.length - 1], 3);

        if (tmp.units.base !== '' && tmp.units.quote !== '') {
          msg += ' ' + tmp.units.quote + '/' + tmp.units.base;
        }
      }
      bootbox.dialog({
        message: msg,
        title: title,
        animate: false,
        buttons: {
          success: {
            label: "Goto",
            className: "btn-warning",
            callback: function() {
              Router.go("actives.details", { strategyId: aData.strategyId });
            }
          },
          danger: {
            label: "Ok",
            className: "btn-default"
          }
        }
      });
    }


    /* browser notification sound */
    if (Settings.findOne().enBrNtfctnSnd && !Meteor.isCordova) {
      ntfySnd.play();
    }


    /* app notification dialog */
    if (Settings.findOne().enAppNtfctn) {
    }


    /* app notification sound */
    if (Settings.findOne().enAppNtfctnSnd ) {
    }

    return true;
  }
});
