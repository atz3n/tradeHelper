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

/***********************************************************************
  Interface
 ***********************************************************************/

export function IExchange(){};


/***********************************************************************
  Function Prototypes
 ***********************************************************************/

IExchange.prototype.setConfig = function() {
    throw new Error('This method must be overwritten!');
}


IExchange.prototype.getConfig = function() {
    throw new Error('This method must be overwritten!');
}


IExchange.prototype.getStatus = function() {
    throw new Error('This method must be overwritten!');
}


IExchange.prototype.getInfo = function() {
    throw new Error('This method must be overwritten!');
}


IExchange.prototype.getPairUnits = function() {
    throw new Error('This method must be overwritten!');
}


IExchange.prototype.getPrice = function() {
    throw new Error('This method must be overwritten!');
}


IExchange.prototype.update = function() {
    throw new Error('This method must be overwritten!');
}


IExchange.prototype.sell = function() {
    throw new Error('This method must be overwritten!');
}


IExchange.prototype.buy = function() {
    throw new Error('This method must be overwritten!');
}


IExchange.prototype.getInstInfo = function() {
    throw new Error('This method must be overwritten!');
}