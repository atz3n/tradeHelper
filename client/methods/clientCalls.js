Meteor.subscribe("settings_first");
Meteor.subscribe("strategies");
Meteor.subscribe("active_datas");


Meteor.ClientCall.methods({

  notification: function(infos) {
    if (Settings.findOne().enBrNtfctn) {
      var mode = Strategies.find({ _id: infos.strategyId }).fetch()[0].mode;
      var aData = ActiveDatas.findOne({ strategyId: infos.strategyId });
      bootbox.hideAll();


      var title = '';
      if (mode === 'manual') {
        title = aData.strategyName + ' ' + aData.state;
      }
      if (mode === 'semiAuto') {

      }
      if (mode === 'auto') {
        title = aData.strategyName + ' ' + aData.position + ' ' + aData.state;
      }

      var msg = "Price: ";

      for (k in aData.exchanges) {
        var tmp = aData.exchanges[k];
        if (k != 0) msg += ', ';
        msg += cropFracDigits(tmp.price[tmp.price.length - 1], 3);

        if (tmp.units.counter !== '' && tmp.units.denominator !== '') {
          msg += ' ' + tmp.units.counter + '/' + tmp.units.denominator;
        }
      }
      bootbox.dialog({
        message: msg,
        title: title,
        animate: false,
        buttons: {
          success: {
            label: "Goto",
            className: "btn-info",
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


      if (Meteor.Device.isPhone()) {
        setTimeout(function() { alert('Phone'); }, 1);
      }
    }
    return true;
  }
});
