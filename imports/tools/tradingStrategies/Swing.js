/**
 * @description:
 * <Description>
 *
 * <Optional informations>
 * 
 * @author Atzen
 * @version 1.0
 * 
 * CHANGES:
 * 02-Jun-2015 : Initial version
 */


// import { Instance } from '../dir/example.js';
import '../system/mathFunctions.js';


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

// var variable = 'Value';
var _dataInit = {
  frozenVal: 'init',
  topVal: '0',
  bottomVal: '0'
};

var _statesInit = {
  long = false,
  short = false,
};


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

Swing.ConfigDefault = {
  longNoPosNotifyPerc: '5', // no position -> buy
  longAfterTopSellNotifyPerc: '5' // long position -> sell after top
  shortNoPosNotifyPerc: '5', // no position -> sell
  shortAfterBottomBuyNotifyPerc: '5' // short position -> buy after bottom
}


Swing.SettingDefault = {
  enableLong: true,
  enableShort: false,
}


/***********************************************************************
  Private Static Function
 ***********************************************************************/

// var variable = function(param){
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

export function Swing() {

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/


  // var variable = 'Value';
  var _price = 'init';


  var _config = Object.assign({}, Swing.ConfigDefault);
  var _setting = Object.assign({}, Swing.SettingDefault);
  var _data = Object.assign({}, Swing._dataInit);
  var _states = Object.assign({}, Swing._statesInit);

  var _buyNotifyFunc = 'init';
  var _sellNotifyFunc = 'init';

  var _active = false;

  var tempState = 'init';


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

  this.setConfig = function(config) {
    _config = Object.assign({}, config);
  }


  this.update = function(price) {
    if (_active) {
      _price = price;

      _data.topVal = Math.max(_data.topVal, _price);
      _data.bottomVal = Math.min(_data.bottomVal, _price);


      /* start "longen" or shorten */
      if (_setting.enableLong && _setting.enableShort && !_states.long && !_states.short) {
        if (percentage(_price, _data.frozenVal) <= _config.shortNoPosNotifyPerc) {
          tempState = 'short';
          sellNotifyFunction();
        }

        if (percentage(_price, _data.frozenVal) >= _config.longNoPosNotifyPerc) {
          tempState = 'long';
          buyNotifyFunction();
        }
      }


      /* start shorten */
      if (!_setting.enableLong && _setting.enableShort && !_states.long && !_states.short) {
        if (percentage(_price, _data.frozenVal) <= _config.shortNoPosNotifyPerc) {
          tempState = 'short';
          sellNotifyFunction();
        }
      }

      /* end shorten */
      if (_setting.enableShort && !_states.long && _states.short) {
        if (percentage(_price, _data.bottomVal) >= _config.shortAfterBottomBuyNotifyPerc) {
          tempState = 'short';
          buyNotifyFunction();
        }
      }


      /* start "longen" */
      if (_setting.enableLong && !_setting.enableShort && !_states.long && !_states.short) {
        if (percentage(_price, _data.frozenVal) >= _config.longNoPosNotifyPerc) {
          tempState = 'long';
          buyNotifyFunction();
        }
      }

      /* end shorten */
      if (_setting.enableLong && _states.long && !_states.short) {
        if (percentage(_price, _data.topVal) <= _config.longAfterTopSellNotifyPerc) {
          tempState = 'long';
          sellNotifyFunction();
        }
      }
    }
  }


  this.getData = function() {
    return Object.assign({}, _data);
  }


  this.start = function() {
    _data.frozenVal = _price;
    _active = true;
  }


  this.stop = function() {
    _data = Object.assign({}, Swing._dataInit);
    _states = Object.assign({}, Swing._statesInit);
    _active = false;
  }


  this.pause = function() {
    _active = false;
  }


  this.bought = function() {
    if (tempState == 'short') {
      _states.short = false;
    }

    if (tempState == 'long') {
      _states.long = true;
    }
  }


  this.sold = function() {
    if (tempState == 'short') {
      _states.short = true;
    }

    if (tempState == 'long') {
      _states.long = false;
    }
  }


  this.setBuyNotifyFunc = function(buyNotifyFunction) {
    _buyNotifyFunc = buyNotifyFunction;
  }


  this.setSellNotifyFunc = function(sellNotifyFunction) {
    _sellNotifyFunc = sellNotifyFunction;
  }
}
