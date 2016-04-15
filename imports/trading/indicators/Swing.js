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
import '../../tools/miscFunctions.js';
import { Iindicator } from '../../api/Iindicator.js'


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

// var variable = 'Value';
var _dataInit = {
  currentVal: 0,
  frozenVal: 0,
  topVal: 0,
  bottomVal: 0
};

var _statesInit = {
  long: false,
  short: false
};


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

Swing.ConfigDefault = {
  longNoPosNotifyPerc: 5, // no position -> buy
  longAfterTopSellNotifyPerc: 5, // long position -> sell after top
  shortNoPosNotifyPerc: 5, // no position -> sell
  shortAfterBottomBuyNotifyPerc: 5 // short position -> buy after bottom
}


Swing.SettingDefault = {
  enableLong: true,
  enableShort: true,
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
    Inheritances
   ***********************************************************************/

  Iindicator.apply(this);


  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  // var variable = 'Value';
  // var _price = 'init';


  var _config = Object.assign({}, Swing.ConfigDefault);
  var _setting = Object.assign({}, Swing.SettingDefault);
  var _data = Object.assign({}, _dataInit);
  var _states = Object.assign({}, _statesInit);

  var _buyNotifyFunc = function() {};
  var _sellNotifyFunc = function() {};

  var _active = false;

  var tempState = 'init';


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  // this.Variable = 'Value'; 


  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  // var _setStartData = function(param) {
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
      _data.currentVal = price;

      _data.topVal = Math.max(_data.topVal, _data.currentVal);
      _data.bottomVal = Math.min(_data.bottomVal, _data.currentVal);


      /* start "longen" or shorten */
      if (!_states.long && !_states.short) {
        if (_setting.enableShort) {
          if (Math.abs(percentage(_data.currentVal, _data.frozenVal)) >= _config.shortNoPosNotifyPerc && _data.currentVal < _data.frozenVal) {
            tempState = 'short';
            _sellNotifyFunc();
          }
        }

        if (_setting.enableLong) {
          if (Math.abs(percentage(_data.currentVal, _data.frozenVal)) >= _config.longNoPosNotifyPerc && _data.currentVal > _data.frozenVal) {
            tempState = 'long';
            _buyNotifyFunc();
          }
        }
      }


      /* end shorten */
      if (!_states.long && _states.short) {
        if (Math.abs(percentage(_data.currentVal, _data.bottomVal)) >= _config.shortAfterBottomBuyNotifyPerc) {
          tempState = 'short';
          _buyNotifyFunc();
        }
      }

      /* end "longen" */
      if (_states.long && !_states.short) {
        if (Math.abs(percentage(_data.currentVal, _data.topVal)) >= _config.longAfterTopSellNotifyPerc) {
          tempState = 'long';
          _sellNotifyFunc();
        }
      }
    }
  }


  this.getConfig = function() {
    return Object.assign({}, _config);
  }


  this.getStatus = function() {

  }


  this.getData = function() {
    return Object.assign({}, _data);
  }


  this.start = function(price) {
    _data.currentVal = price;
    _data.frozenVal = price;
    _data.bottomVal = price;
    _data.topVal = price;
    _active = true;
  }


  this.stop = function() {
    _active = false;
    _data = Object.assign({}, Swing._dataInit);
    _states = Object.assign({}, Swing._statesInit);
  }


  this.pause = function() {
    _active = false;
  }


  this.bought = function(price) {
    if (_active) {

      if (typeof price !== 'undefined') {
        _data.frozenVal = price;
      } else {
        _data.frozenVal = _data.currentVal;
      }

      if (tempState == 'short') {
        _states.short = false;
      }

      if (tempState == 'long') {
        _states.long = true;

        /* restart */
        this.start(_data.currentVal);
      }
    }
  }


  this.sold = function(price) {
    if (_active) {

      if (typeof price !== 'undefined') {
        _data.frozenVal = price;
      } else {
        _data.frozenVal = _data.currentVal;
      }

      if (tempState == 'short') {
        _states.short = true;
      }

      if (tempState == 'long') {
        _states.long = false;

        /* restart */
        this.start(_data.currentVal);
      }
    }
  }


  this.setBuyNotifyFunc = function(buyNotifyFunction) {
    _buyNotifyFunc = buyNotifyFunction;
  }


  this.setSellNotifyFunc = function(sellNotifyFunction) {
      _sellNotifyFunc = sellNotifyFunction;
  }
}
