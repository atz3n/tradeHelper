/**
 * @description:
 * Interface template for Plugins
 *
 * All Plugins must implement these functions to work probably
 * 
 * @author Atzen
 * @version 4.0.0
 * 
 * CHANGES:
 * 01-Jul-2016 : Initial version
 * 22-Jul-2016 : added name element to getInstInfo() return object
 * 24-Jul-2016 : changed getConfig() return result object to array (same structure as getInfo())
 * 26-Jul-2016 : included default configuration object
 * 12-Aug-2016 : bugfix: added configuration parameter in setConfig() signature
 * 26-Nov-2016 : added volume parameter in bought/sold function
 * 30-Nov-2016 : changed getState function to getActiveState
 * 05-Jan-2017 : added reset function
 */

/***********************************************************************
  Interface
 ***********************************************************************/

export function IPlugin(){};


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

/**
 * Default Configuration structure
 * Every Plugin should implement a public static default configuration object including an id, a name and depending configuration elements.
 * It should be a working default configuration, too.
 * @type {Object}
 */
IPlugin.ConfigDefault = {
  id: 'undefined',
  name: 'undefined',
}


/***********************************************************************
  Function Prototypes
 ***********************************************************************/

/**
 * Sets Class specific configurations
 * @param {Object} configuration class specific configuration
 */
IPlugin.prototype.setConfig = function(configuration) {
    throw new Error('This method must be overwritten!');
}


/**
 * Returns the configuration
 * @return {Object} configuration array [{title: <title>, value: <value>}]
 */
IPlugin.prototype.getConfig = function() {
    throw new Error('This method must be overwritten!');
}


/**
 * Returns the active state of a plugin (true = active / false = inactive)
 * @return {boolean} true/false
 */
IPlugin.prototype.getActiveState = function() {
    throw new Error('This method must be overwritten!');
}


/**
 * Returns important informations  
 * @return {Object} information array [{title: <title>, value: <value>}]
 */
IPlugin.prototype.getInfo = function() {
    throw new Error('This method must be overwritten!');
}


/**
 * This function will be called at start and resume of Strategy class
 * @param  {Number} price trade price calculated from an exchange
 */
IPlugin.prototype.start = function(price) {
    throw new Error('This method must be overwritten!');
}


/**
 * This function will be called at an reset request of an plugin
 * @param  {Number} price trade price calculated from an exchange
 */
IPlugin.prototype.reset = function(price) {
    throw new Error('This method must be overwritten!');
}


/**
 * Will be called from Strategy class to update the trade price
 * @param  {Number} price trade price calculated from an exchange
 */
IPlugin.prototype.update = function(price) {
    throw new Error('This method must be overwritten!');
}


/**
 * Will be called from Strategy class after a successfully performed buy
 * @param  {Number} price buy price
 * @param  {Number} volume bought volume (undefined if position out trade)
 */
IPlugin.prototype.bought = function(price, volume) {
    throw new Error('This method must be overwritten!');
}


/**
 * Will be called from Strategy class after a successfully performed sell
 * @param  {Number} price sell price
 * @param  {Number} volume sold volume (undefined if position out trade)
 */
IPlugin.prototype.sold = function(price, volume) {
    throw new Error('This method must be overwritten!');
}


/**
 * Sets the notification function which will be called when a plugin indicates a buy
 * 
 * It has the following signature: <buyNotifyFunction>(instInfo) where
 *   instInfo {object} is the return object of getInstInfo()
 *   
 * @param {function} buyNotifyFunction the notification function
 */
IPlugin.prototype.setBuyNotifyFunc = function(buyNotifyFunction) {
    throw new Error('This method must be overwritten!');
}


/**
 * Sets the notification function which will be called when a plugin indicates a sell
 * 
 * It has the following signature: <sellNotifyFunction>(instInfo) where
 *   instInfo {object} is the return object of getInstInfo()
 *   
 * @param {function} sellNotifyFunction the notification function
 */
IPlugin.prototype.setSellNotifyFunc = function(sellNotifyFunction) {
    throw new Error('This method must be overwritten!');
}


/**
 * Returns instant specific informations
 * @return {Object} info object {id: <instance Id>, name: <instance name>, type: <exchange type>}
 */
IPlugin.prototype.getInstInfo = function() {
    throw new Error('This method must be overwritten!');
}


/**
 * Returns available positions
 * @return {Object} info object {long: true/false, short: true/false}
 */
IPlugin.prototype.getPositions = function() {
    throw new Error('This method must be overwritten!');
}