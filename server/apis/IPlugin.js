/**
 * @description:
 * Interface template for Plugins
 *
 * All Plugins must implement these functions to work probably
 * 
 * @author Atzen
 * @version 1.0
 * 
 * CHANGES:
 * 01-July-2016 : Initial version
 */

/***********************************************************************
  Interface
 ***********************************************************************/

export function IPlugin(){};


/***********************************************************************
  Function Prototypes
 ***********************************************************************/

/**
 * Sets Class specific configurations
 * @param {Object} configuration class specific configuration
 */
IPlugin.prototype.setConfig = function() {
    throw new Error('This method must be overwritten!');
}


/**
 * Returns the configuration
 * @return {Object} configuration object
 */
IPlugin.prototype.getConfig = function() {
    throw new Error('This method must be overwritten!');
}


/**
 * Returns the state of a plugin
 * @return {String} in/out
 */
IPlugin.prototype.getState = function() {
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
 * Will be called from Strategy class to update the trade price
 * @param  {Number} price trade price calculated from an exchange
 */
IPlugin.prototype.update = function(price) {
    throw new Error('This method must be overwritten!');
}


/**
 * Will be called from Strategy class after a successfully performed buy
 * @param  {Number} price buy price
 */
IPlugin.prototype.bought = function(price) {
    throw new Error('This method must be overwritten!');
}


/**
 * Will be called from Strategy class after a successfully performed sell
 * @param  {Number} price sell price
 */
IPlugin.prototype.sold = function(price) {
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
 * @return {Object} info object {id: <instance Id>, type: <plugin type>}
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