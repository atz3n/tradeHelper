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

var _positionsInit = {
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

export function Swing(logger) {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  Iindicator.apply(this);


  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  var _config = Object.assign({}, Swing.ConfigDefault);
  var _setting = Object.assign({}, Swing.SettingDefault);
  var _data = Object.assign({}, _dataInit);
  var _positions = Object.assign({}, _positionsInit);

  var _buyNotifyFunc = function() {};
  var _sellNotifyFunc = function() {};

  var _active = false;

  var _tmpPos = 'init';

  var _logger = logger;

  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  // this.Variable = 'Value'; 


  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  var _log = function(message){
    if(_logger !== 'undefined')
      _logger.debug('Swing: ' + message);
  }


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


      /* open long or short */
      if (!_positions.long && !_positions.short) {

        /* open short */
        if (_setting.enableShort) {
          if (Math.abs(percentage(_data.currentVal, _data.frozenVal)) >= _config.shortNoPosNotifyPerc && _data.currentVal < _data.frozenVal) {
            _log('Short Open, ' + 'pos long: ' +  _positions.long + ', pos short: ' + _positions.short);

            _tmpPos = 'short';
            _sellNotifyFunc();
          }
        }

        /* open long */
        if (_setting.enableLong) {
          if (Math.abs(percentage(_data.currentVal, _data.frozenVal)) >= _config.longNoPosNotifyPerc && _data.currentVal > _data.frozenVal) {
            _log('Long Open, ' + 'pos long: ' +  _positions.long + ', pos short: ' + _positions.short);
            
            _tmpPos = 'long';
            _buyNotifyFunc();
          }
        }

      }


      /* close short */
      if (!_positions.long && _positions.short) {
        if (Math.abs(percentage(_data.currentVal, _data.bottomVal)) >= _config.shortAfterBottomBuyNotifyPerc) {
          _log('Short Close, ' + 'pos long: ' +  _positions.long + ', pos short: ' + _positions.short);

          _tmpPos = 'short';
          _buyNotifyFunc();
        }
      }

      /* close long */
      if (_positions.long && !_positions.short) {
        if (Math.abs(percentage(_data.currentVal, _data.topVal)) >= _config.longAfterTopSellNotifyPerc) {
          _log('Long Close, ' + 'pos long: ' +  _positions.long + ', pos short: ' + _positions.short);

          _tmpPos = 'long';
          _sellNotifyFunc();
        }
      }
    }
  }


  this.getConfig = function() {
    return Object.assign({}, _config);
  }


  this.getStatus = function() {
    if(_positions.long || _positions.short)
      return 'in';
    else
      return 'out';
  }


  this.getData = function() {
    return Object.assign({}, _data);
  }


  this.start = function(price) {
    _log('start tracking');
    _data.currentVal = price;
    _data.frozenVal = price;
    _data.bottomVal = price;
    _data.topVal = price;
    _active = true;
  }


  this.stop = function() {
    _log('stop tracking');
    _active = false;
    _data = Object.assign({}, Swing._dataInit);
    _positions = Object.assign({}, Swing._positionsInit);
  }


  this.pause = function() {
    _log('pause tracking');
    _active = false;
  }


  this.bought = function(price) {
    if (_active) {

      if (typeof price !== 'undefined') {
        _data.frozenVal = price;
      } else {
        _data.frozenVal = _data.currentVal;
      }

      if (_tmpPos == 'short') {
        _positions.short = false;

        _log('Short Closed, ' + 'pos long: ' +  _positions.long + ', pos short: ' + _positions.short);
      }

      if (_tmpPos == 'long') {
        _positions.long = true;

        _log('Long Opened, ' + 'pos long: ' +  _positions.long + ', pos short: ' + _positions.short);
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

      if (_tmpPos == 'short') {
        _positions.short = true;

        _log('Short Opened, ' + 'pos long: ' +  _positions.long + ', pos short: ' + _positions.short);
      }

      if (_tmpPos == 'long') {
        _positions.long = false;

        _log('Long Closed, ' + 'pos long: ' +  _positions.long + ', pos short: ' + _positions.short);
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