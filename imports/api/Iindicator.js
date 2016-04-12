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

export function Iindicator(){};


/***********************************************************************
  Function Prototypes
 ***********************************************************************/

Iindicator.prototype.setConfig = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.getConfig = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.getStatus = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.getData = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.start = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.stop = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.pause = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.update = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.bought = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.sold = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.setBuyNotification = function() {
    throw new Error('This method must be overwritten!');
}


Iindicator.prototype.setSellNotifyFunc = function() {
    throw new Error('This method must be overwritten!');
}