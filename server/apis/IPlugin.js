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

export function IPlugin(){};


/***********************************************************************
  Function Prototypes
 ***********************************************************************/

IPlugin.prototype.setConfig = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.getConfig = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.getStatus = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.getInfo = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.start = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.stop = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.pause = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.update = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.bought = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.sold = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.setBuyNotifyFunc = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.setSellNotifyFunc = function() {
    throw new Error('This method must be overwritten!');
}


IPlugin.prototype.getInstInfo = function() {
    throw new Error('This method must be overwritten!');
}