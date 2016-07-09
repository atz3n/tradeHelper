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


import { IPlugin } from '../../apis/IPlugin.js'


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

var _dataInit = {
  currentVal: 0,
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

PlSwing.ConfigDefault = {
  id: 'undefined',
  longNoPosNotifyPerc: 5, // no position -> buy
  longAfterTopSellNotifyPerc: 5, // long position -> sell after top
  shortNoPosNotifyPerc: 5, // no position -> sell
  shortAfterBottomBuyNotifyPerc: 5, // short position -> buy after bottom
  enableLong: true,
  enableShort: false
}


/***********************************************************************
  Private Static Function
 ***********************************************************************/

/***********************************************************************
  Public Static Function
 ***********************************************************************/

/***********************************************************************
  Class
 ***********************************************************************/

export function PlSwing(logger) {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

  IPlugin.apply(this);


  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  var _config = Object.assign({}, PlSwing.ConfigDefault);
  var _data = Object.assign({}, _dataInit);
  var _positions = Object.assign({}, _positionsInit);

  var _buyNotifyFunc = function() {};
  var _sellNotifyFunc = function() {};


  var _tmpPos = 'init';

  var _logger = logger;


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  var _log = function(message) {
    if (typeof _logger !== 'undefined')
      _logger.debug('PlSwing: ' + message);
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  this.setConfig = function(config) {
    _config = Object.assign({}, config);
  }


  this.update = function(price) {
    _data.currentVal = price;

    _data.topVal = Math.max(_data.topVal, _data.currentVal);
    _data.bottomVal = Math.min(_data.bottomVal, _data.currentVal);


    /* open long or short */
    if (!_positions.long && !_positions.short) {

      /* open short */
      if (_config.enableShort) {
        if (Math.abs(percentage(_data.currentVal, _data.topVal)) >= _config.shortNoPosNotifyPerc && _data.currentVal < _data.topVal) {
          _log('Short Open, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);

          _tmpPos = 'short';
          _sellNotifyFunc(this.getInstInfo());
        }
      }

      /* open long */
      if (_config.enableLong) {
        if (Math.abs(percentage(_data.currentVal, _data.bottomVal)) >= _config.longNoPosNotifyPerc && _data.currentVal > _data.bottomVal) {
          _log('Long Open, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);

          _tmpPos = 'long';
          _buyNotifyFunc(this.getInstInfo());
        }
      }

    }


    /* close short */
    if (!_positions.long && _positions.short) {
      if (Math.abs(percentage(_data.currentVal, _data.bottomVal)) >= _config.shortAfterBottomBuyNotifyPerc) {
        _log('Short Close, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);

        _tmpPos = 'short';
        _buyNotifyFunc(this.getInstInfo());
      }
    }

    /* close long */
    if (_positions.long && !_positions.short) {
      if (Math.abs(percentage(_data.currentVal, _data.topVal)) >= _config.longAfterTopSellNotifyPerc) {
        _log('Long Close, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);

        _tmpPos = 'long';
        _sellNotifyFunc(this.getInstInfo());
      }
    }
  }


  this.getConfig = function() {
    var conf = {};

    conf.OpenLongPosition = _config.longNoPosNotifyPerc + '%';
    conf.CloseLongPosition = _config.longAfterTopSellNotifyPerc + '%';
    conf.OpenShortPosition = _config.shortNoPosNotifyPerc + '%';
    conf.CloseShortPosition = _config.shortAfterBottomBuyNotifyPerc + '%';
    conf.EnableLong = _config.enableLong
    conf.EnableShort = _config.enableShort

    return conf;
  }


  this.getState = function() {
    if (_positions.long || _positions.short)
      return 'in';
    else
      return 'out';
  }



  this.getInfo = function() {
    var info = {};

    info.Top = cropFracDigits(_data.topVal, 6);
    info.Current = cropFracDigits(_data.currentVal, 6);
    info.Bottom = cropFracDigits(_data.bottomVal, 6);

    return info;
  }


  this.start = function(price) {
    _log('start tracking');
    _data.currentVal = price;
    _data.bottomVal = price;
    _data.topVal = price;
  }



  this.bought = function(price) {
    _data.currentVal = price;
    _data.topVal = price;
    _data.bottomVal = price;

    if (_tmpPos == 'short') {
      _positions.short = false;

      _log('Short Closed, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);
    }

    if (_tmpPos == 'long') {
      _positions.long = true;

      _log('Long Opened, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);
    }
  }


  this.sold = function(price) {
    _data.currentVal = price;
    _data.topVal = price;
    _data.bottomVal = price;

    if (_tmpPos == 'short') {
      _positions.short = true;

      _log('Short Opened, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);
    }

    if (_tmpPos == 'long') {
      _positions.long = false;

      _log('Long Closed, ' + 'pos long: ' + _positions.long + ', pos short: ' + _positions.short);
    }
  }


  this.setBuyNotifyFunc = function(buyNotifyFunction) {
    _buyNotifyFunc = buyNotifyFunction;
  }


  this.setSellNotifyFunc = function(sellNotifyFunction) {
    _sellNotifyFunc = sellNotifyFunction;
  }


  this.getInstInfo = function() {
    return {
      id: _config.id,
      type: "PlSwing"
    }
  }

  this.getPositions = function() {
    return {long: _config.enableLong, short: _config.enableShort}
  }
}
