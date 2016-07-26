/**
 * @description:
 * Interface template for Exchanges
 *
 * All Exchanges should implement these functions to work probably
 * 
 * @author Atzen
 * @version 2.0
 * 
 * CHANGES:
 * 01-July-2016 : Initial version
 * 09-July-2016 : added getPositions
 * 22-July-2016 : added name element to getInstInfo() return result object
 * 24-July-2016 : changed getConfig() return result object to array (same structure as getInfo())
 * 26-July-2016 : included default configuration object
 */

/***********************************************************************
  Interface
 ***********************************************************************/

export function IExchange() {};


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

/**
 * Default Configuration structure
 * Every Exchange should implement a public static default configuration object including an id, a name and depending configuration elements.
 * It should be a working default configuration, too.
 * @type {Object}
 */
IExchange.ConfigDefault = {
  id: 'undefined',
  name: 'undefined',
}


/***********************************************************************
  Static Function
 ***********************************************************************/

/**
 * returns tradeable security pairs and additional informations
 * @return {Object} obj.error: ExError error, obj.result: security pairs or error message (in case of ExError != ExError.ok)
 */
getTradePairInfos = function() {
  throw new Error('This method must be overwritten!');
}


/***********************************************************************
  Error Type
 ***********************************************************************/

/**
 * Error object
 * @type {Object}
 */
ExError = {
  ok: 'OK', // no error, everything is fine
  srvConError: 'SERVER_CONNECTION_ERROR', // a server error occurred
  toLessBalance: 'BALANCE_TO_LESS', // user has to less balance
  error: 'ERROR', // unknown or general error
  parseError: 'PARSE_ERROR', // error while parsing an input
  notImpl: 'NOT_YET_IMPLEMENTED', // not yet implemented
  exTypNotFound: 'EXCHANGE_TYPE_NOT_FOUND', // exchange type is wrong or could not be found
  finished: 'EXCHANGE_FINISHED' // exchange is finished (i.e. when ExTestDatas data array is complete proceeded)
}


/***********************************************************************
  Function Prototypes
 ***********************************************************************/

/**
 * Sets Class specific configurations
 * @param {Object} configuration class specific configuration
 * @return {Object} obj.error: ExError, obj.result: null or error message;
 */
IExchange.prototype.setConfig = function(configuration) {
  throw new Error('This method must be overwritten!');
}


/**
 * Returns the configuration
 * @return {Object} obj.error: ExError, obj.result: configuration array [{title: <title>, value: <value>}]
 */
IExchange.prototype.getConfig = function() {
  throw new Error('This method must be overwritten!');
}


/**
 * Returns important informations  
 * @return {Object} obj.error: ExError, obj.result: information array [{title: <title>, value: <value>}]
 */
IExchange.prototype.getInfo = function() {
  throw new Error('This method must be overwritten!');
}


/**
 * Returns security pair units
 * @return {Object} obj.error: ExError, obj.result: pair object {base: <base>, quote: <quote>}
 */
IExchange.prototype.getPairUnits = function() {
  throw new Error('This method must be overwritten!');
}


/**
 * Returns bought/sold volume
 * @return {Object} obj.error: ExError, obj.result: volume
 */
IExchange.prototype.getVolume = function() {
  throw new Error('This method must be overwritten!');
}


/**
 * Returns calculated price
 * @return {Object} obj.error: ExError, obj.result: price
 */
IExchange.prototype.getPrice = function() {
  throw new Error('This method must be overwritten!');
}


/**
 * Returns bought/sold price
 * @return {Object} obj.error: ExError, obj.result: price
 */
IExchange.prototype.getTradePrice = function() {
  throw new Error('This method must be overwritten!');
}


/**
 * Calculates actual price
 * @return {Object} obj.error: ExError, obj.result: null or error message
 */
IExchange.prototype.update = function() {
  throw new Error('This method must be overwritten!');
}


/**
 * Sells calculated amount of base security
 * @param  {string} position trade position ('long'/'short')
 * @return {none}          no return, uses <soldNotifyFunction> (see setSoldNotifyFunc())
 */
IExchange.prototype.sell = async function(position) {
  throw new Error('This method must be overwritten!');
}


/**
 * Buys calculated amount of base security
 * @param  {string} position trade position ('long'/'short')
 * @return {none}          no return, uses <boughtNotifyFunction> (see setBoughtNotifyFunc())
 */
IExchange.prototype.buy = async function(position) {
  throw new Error('This method must be overwritten!');
}


/**
 * Stops the current buy or sell process
 * @return {Object} obj.error: ExError, obj.result: null or error message
 */
IExchange.prototype.stopTrade = function() {
  throw new Error('This method must be overwritten!');
}


/**
 * Returns instant specific informations
 * @return {Object} obj.error: ExError, obj.result: info object {id: <instance Id>, name: <instance name>, type: <exchange type>}
 */
IExchange.prototype.getInstInfo = function() {
  throw new Error('This method must be overwritten!');
}


/**
 * Returns available positions
 * @return {Object} obj.error: ExError, obj.result: info object {long: true/false, short: true/false}
 */
IExchange.prototype.getPositions = function() {
  throw new Error('This method must be overwritten!');
}


/**
 * Sets the notification function which will be called from buy function.
 * This function will be called if an error occurs or the buy process finishes successfully.
 * 
 * It has the following signature: <boughtNotifyFunction>(instInfo, errObject) where
 *   instInfo {object} is the return object of getInstInfo().result
 *   errObject {object} contains obj.error: ExError and obj.result: error message (if ExError != ExError.ok)
 *   
 * @param {function} boughtNotifyFunction the notification function
 * @return {Object} obj.error: ExError, obj.result: null or error message
 */
IExchange.prototype.setBoughtNotifyFunc = function(boughtNotifyFunction) {
  throw new Error('This method must be overwritten!');
}


/**
 * Sets the notification function which will be called from sell function.
 * This function will be called if an error occurs or the sell process finishes successfully.
 * 
 * It has the following signature: <soldNotifyFunction>(instInfo, errObject) where
 *   instInfo {object} is the return object of getInstInfo().result
 *   errObject {object} contains obj.error: ExError and obj.result: error message (if ExError != ExError.ok)
 *   
 * @param {function} soldNotifyFunction the notification function
 * @return {Object} obj.error: ExError, obj.result: null or error message
 */
IExchange.prototype.setSoldNotifyFunc = function(soldNotifyFunction) {
  throw new Error('This method must be overwritten!');
}
