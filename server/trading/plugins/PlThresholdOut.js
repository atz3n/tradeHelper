/**
 * @description:
 * Class for threshold trading (for in to out positioning)
 *
 * 
 * This class implements a configurable threshold to go out of a position
 *
 * 
 * @author Atzen
 * @version 0.4.0
 *
 * 
 * CHANGES:
 * 02-Dez-2016 : Initial version
 * 05-Jan-2017 : adapted to IPlugin v 4.0.0
 * 11-Jan-2017 : added logging mechanism
 * 18-Mar-2017 : added threshold exceeding counter
 */


import { IPlugin } from '../../apis/IPlugin.js'


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

/***********************************************************************
  Public Static Variable
 ***********************************************************************/

/**
 * Configuration structure
 * @type {Object}
 */
PlThresholdOut.ConfigDefault = {
    id: 'undefined',
    name: 'undefined',

    thresholdBase: 'profit', // price (curPrice - inPrice), profit ((curPrice - inPrice) * inVolume)

    thresholdType: 'value', // value (total amount), percentage (relative to in price)
    thresholdAmount: 0,
    thresholdExceedCnt: 1, // plugin only sets an action (buy/sell) when the threshold is exceeded this number of times in a row

    enLong: true, // enable long trading
    enShort: true // enable short trading
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

export function PlThresholdOut(logger) {

    /***********************************************************************
      Inheritances
     ***********************************************************************/

    IPlugin.apply(this);


    /***********************************************************************
      Private Instance Variable
     ***********************************************************************/

    /**
     * Internal configuration object
     * @type {Object}
     */
    var _config = Object.assign({}, PlThresholdOut.ConfigDefault);

    /**
     * High / Low Price
     * @type {Number}
     */
    var _highLowPrice = 0;

    /**
     * Current Price
     * @type {Number}
     */
    var _curPrice = 0;

    /**
     * Position in Volume
     * @type {Number}
     */
    var _inVolume = 0;

    /**
     * Threshold counter
     * @type {Number}
     */
    var _thrshldCnt = 0;

    /**
     * Trade position
     * @type {String}
     */
    var _position = 'none';

    /**
     * Active state
     * @type {Boolean}
     */
    var _active = false;

    /**
     * message string that a log message starts with
     * @type {String}
     */
    var _logPreMsg = '';

    /**
     * Callback function that will be called when a buy action is calculated
     */
    var _buyNotifyFunc = function() {};

    /**
     * Callback function that will be called when a sell action is calculated
     */
    var _sellNotifyFunc = function() {};


    /***********************************************************************
      Public Instance Variable
     ***********************************************************************/

    /***********************************************************************
      Private Instance Function
     ***********************************************************************/

    /**
     * Checks configuration
     * @return {bool} false if error occurs
     */
    var _checkConfig = function() {
        if (_config.id === 'undefined') return false;

        if (_config.thresholdBase !== 'price' && _config.thresholdBase !== 'profit') return false;

        if (_config.thresholdType !== 'value' && _config.thresholdType !== 'percentage') return false;

        if (isNaN(_config.thresholdAmount)) return false;
        if (_config.thresholdAmount < 0) return false;

        if (_config.thresholdType === 'percentage') {
            if (_config.thresholdAmount > 100) return false;
        }

        if (isNaN(_config.thresholdExceedCnt)) return false;
        if (_config.thresholdExceedCnt < 1) return false;

        if (typeof _config.enLong !== 'boolean') return false;
        if (typeof _config.enShort !== 'boolean') return false;

        return true;
    }


    /***********************************************************************
      Public Instance Function
     ***********************************************************************/

    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.setConfig = function(configuration) {
        _logPreMsg = 'PlThresholdOut ' + configuration.id + ': ';
        logger.debug(_logPreMsg + 'setConfig()');


        _config = mergeObjects(_config, configuration);


        return _checkConfig();
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.getConfig = function() {
        logger.debug(_logPreMsg + 'getConfig()');


        return [
            { title: 'Threshold Base', value: _config.thresholdBase },
            { title: 'Threshold Type', value: _config.thresholdType },
            { title: 'Threshold', value: _config.thresholdAmount },
            { title: 'Enable Long', value: JSON.stringify(_config.enLong) },
            { title: 'Enable Short', value: JSON.stringify(_config.enShort) }
        ];
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.getActiveState = function() {
        logger.debug(_logPreMsg + 'getActiveState()');
        return _active;
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.getInfo = function() {
        logger.debug(_logPreMsg + 'getInfo()');


        var tmp = [
            { title: 'High Price', value: '-' },
            { title: 'Low Price', value: '-' },
            { title: 'Current Price', value: cropFracDigits(_curPrice, 6) }
        ];

        if (_position === 'long') tmp[0].value = cropFracDigits(_highLowPrice, 6)
        if (_position === 'short') tmp[1].value = cropFracDigits(_highLowPrice, 6)

        if (!_active)
            for (i in tmp) tmp[i].value = '-';

        return tmp;
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.start = function(price) {
        logger.debug(_logPreMsg + 'start()');


        _position = 'none';

        /* set active state */
        _active = false;
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.reset = function(price) {
        logger.debug(_logPreMsg + 'reset()');


        if (_active) {
            _highLowPrice = price;
            _curPrice = price;
            _thrshldCnt = 0;
        }
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.update = function(price) {
        if (_active) {

            logger.debug(_logPreMsg + 'update() start');


            var diff = 0;
            _curPrice = price;


            /* set base value */
            if (_position === 'long') _highLowPrice = Math.max(_highLowPrice, _curPrice);
            if (_position === 'short') _highLowPrice = Math.min(_highLowPrice, _curPrice);


            /* get difference */
            if (_config.thresholdType === 'percentage') {
                diff = percentage(_curPrice, _highLowPrice);
            } else {
                diff = _curPrice - _highLowPrice;

                if (_config.thresholdBase === 'profit') diff *= _inVolume;
            }


            /* stop long position */
            if (_position === 'long') {

                if (diff < -_config.thresholdAmount) _thrshldCnt++;
                else _thrshldCnt = 0;

                if (_thrshldCnt >= _config.thresholdExceedCnt) {
                    logger.verbose(_logPreMsg + 'sell notification');
                    _sellNotifyFunc(this.getInstInfo());
                }
            }


            /* stop short position */
            if (_position === 'short') {

                if (diff > _config.thresholdAmount) _thrshldCnt++;
                else _thrshldCnt = 0;

                if (_thrshldCnt >= _config.thresholdExceedCnt) {
                    logger.verbose(_logPreMsg + 'buy notification');
                    _buyNotifyFunc(this.getInstInfo());
                }
            }


            logger.debug(_logPreMsg + 'update() end');
        }
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.bought = function(price, volume) {
        logger.debug(_logPreMsg + 'bought()');


        if (_position !== 'long') { // for savety reasons

            /* long in */
            if (_position === 'none') {
                _position = 'long';

                if (_config.enLong) _active = true;
                _highLowPrice = price;

                _inVolume = volume;
            }


            /* short out */
            else {
                _position = 'none';

                _active = false;
                _highLowPrice = 0;
                _thrshldCnt = 0;

                _inVolume = 0;
            }


            _curPrice = price;
        }
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.sold = function(price, volume) {
        logger.debug(_logPreMsg + 'sold()');


        if (_position !== 'short') { // for savety reasons

            /* short in */
            if (_position === 'none') {
                _position = 'short';

                if (_config.enShort) _active = true;
                _highLowPrice = price;

                _inVolume = volume;
            }


            /* long out */
            else {
                _position = 'none';

                _active = false;
                _highLowPrice = 0;
                _thrshldCnt = 0;

                _inVolume = 0;
            }


            _curPrice = price;
        }
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.setBuyNotifyFunc = function(buyNotifyFunction) {
        logger.debug(_logPreMsg + 'setBuyNotifyFunc()');
        _buyNotifyFunc = buyNotifyFunction;
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.setSellNotifyFunc = function(sellNotifyFunction) {
        logger.debug(_logPreMsg + 'setSellNotifyFunc()');
        _sellNotifyFunc = sellNotifyFunction;
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.getInstInfo = function() {
        logger.debug(_logPreMsg + 'getInstInfo()');
        return { id: _config.id, name: _config.name, type: "PlThresholdOut" };
    }


    /**
     * Interface function (see IPlugin.js for detail informations)
     */
    this.getPositions = function() {
        logger.debug(_logPreMsg + 'getPositions()');
        return { long: _config.enLong, short: _config.enShort }
    }


    /***********************************************************************
      Constructor
     ***********************************************************************/
}
