/**
 * @description:
 * <Description>
 *
 * 
 * <Optional informations>
 *
 * 
 * @author Atzen
 * @version 1.0.0
 *
 * 
 * CHANGES:
 * 02-Jun-2015 : Initial version
 */


import { InstHandler } from '../../lib/InstHandler.js';
import { PlSwing } from '../plugins/PlSwing.js';
import { ExKraken } from '../exchanges/ExKraken.js';
import { ExTestData } from '../exchanges/ExTestData.js';



/***********************************************************************
  Private Static Variable
 ***********************************************************************/

// var _variable = 'Value';


/***********************************************************************
  Public Static Variable
 ***********************************************************************/




/***********************************************************************
  Private Static Function
 ***********************************************************************/

// var _variable = function(param){
//   return 'Value';
// }


/***********************************************************************
  Public Static Function
 ***********************************************************************/

// ClassName.function = function(param){
//   return 'Value';
// }


/***********************************************************************
  Class
 ***********************************************************************/

export function Strategy(strategySettings) {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  // InheritancesClass.apply(this);


  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  var _config = '';
  var _strSetting = '';
  var _plugins = new InstHandler();
  var _exchanges = new InstHandler();


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  // this.Variable = 'Value'; 


  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  var _buyNotifyFunc = function() {
    return 'Value';
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  this.develop = function() {
    return _strSetting;

  }


  /***********************************************************************
    Constructor
   ***********************************************************************/

  var _constructor = function(param) {
    _strSetting = Object.assign({}, param);

    /* set config */
    _config = {
      updateTime: _strSetting.updateTime
    }

    /* create plugin and exchange instances */
    for (i = 0; i < _strSetting.pluginBundles.length; i++) {
      for (j = 0; j < _strSetting.pluginBundles[i].bundlePlugins.length; j++) {
        var plugin = _strSetting.pluginBundles[i].bundlePlugins[j];


        /* create not yet created plugin instances */
        if (_plugins.getObject(plugin._id) === 'undefined') {

          if (plugin.type === "plSwing") {
            var conf = Object.assign({}, PlSwing.ConfigDefault);
            conf.longNoPosNotifyPerc = plugin.lnpnp;
            conf.longAfterTopSellNotifyPerc = plugin.latsnp;
            conf.shortNoPosNotifyPerc = plugin.snpnp;
            conf.shortAfterBottomBuyNotifyPerc = plugin.sabbnp;
            conf.enableShort = plugin.enShort;
            conf.enableLong = plugin.enLong;

            _plugins.addObject(plugin._id, new PlSwing());
            _plugins.getObject(plugin._id).setConfig(conf);
          }


          /* create not yet created exchange instances */
          if (_exchanges.getObject(plugin.exchange._id) === 'undefined') {

            if (plugin.exchange.type === 'exKraken') {
              var conf = Object.assign({}, ExKraken.ConfigDefault);
              switch (plugin.exchange.pair) {
                case "Ether/Euro":
                  conf.pair = ExKraken.Pair.eth_eur;
                  break;
                case "Ether/Bitcoin":
                  conf.pair = ExKraken.Pair.eth_btc;
                  break;
                case "Bitcoin/Euro":
                  conf.pair = ExKraken.Pair.btc_eur;
                  break;
                default:
                  conf.pair = ExKraken.Pair.btc_eur;
              }

              _exchanges.addObject(plugin.exchange._id, new ExKraken());
              _exchanges.getObject(plugin.exchange._id).setConfig(conf);


            } else if (plugin.exchange.type === 'exTestData') {
              // var conf = Object.assign({}, exTestData.ConfigDefault);
              _exchanges.addObject(plugin.exchange._id, new ExTestData());
            }
          }
        }
      }
    }
  }

  _constructor(strategySettings)
}
