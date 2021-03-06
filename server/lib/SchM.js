/**
 * @description:
 * Manages schedules
 *
 * 
 * - dependencies:
 *    InstHandler.js v1.4
 *    
 * - static only module
 *
 * 
 * @author Atzen
 * @version 1.0.0
 *
 * 
 * CHANGES:
 * 13-July-2016 : Initial version
 */

import { InstHandler } from './InstHandler.js';


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

/**
 * The schedules
 * @type {InstHandler}
 */
var _schedules = new InstHandler();


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

/***********************************************************************
  Private Static Function
 ***********************************************************************/

/***********************************************************************
  Public Static Function
 ***********************************************************************/

/**
 * Removes all schedules
 */
SchM.removeSchedules = function() {
  for (var i = 0; i < _schedules.getObjectsArray().length; i++) {
    _schedules.getObjectByIdx(i).stop();
  }

  _schedules.clear();
}


/**
 * Stops all schedules
 */
SchM.stopSchedules = function() {
  for (var i = 0; i < _schedules.getObjectsArray().length; i++) {
    _schedules.getObjectByIdx(i).stop();
  }
}


/**
 * Restarts all schedules
 */
SchM.restartSchedules = function() {
  for (var i = 0; i < _schedules.getObjectsArray().length; i++) {
    _schedules.getObjectByIdx(i).restart();
  }
}


/**
 * Creates a schedule
 * @param {string} id               id of schedule
 * @param {number} time             schedule time in seconds
 * @param {function} cyclicFunction callback function that will be executed
 * @param {what ever} cyclicFunctionParam   parameters of callback function
 */
SchM.createSchedule = function(id, time, cyclicFunction, cyclicFunctionParam) {
  _schedules.setObject(id, new Schedule());
  _schedules.getObject(id).createSchedule(time, cyclicFunction, cyclicFunctionParam);
}


/**
 * Removes a schedule
 * @param  {string} id id of schedule
 */
SchM.removeSchedule = function(id) {
  if (_schedules.getObject(id) !== 'undefined') {
    _schedules.getObject(id).stop();
    _schedules.removeObject(id);
  }
}


/**
 * Stops a schedule
 * @param  {string} id id of schedule
 */
SchM.stopSchedule = function(id) {
  if (_schedules.getObject(id) !== 'undefined') {
    _schedules.getObject(id).stop();
  }
}


/**
 * Restarts a schedule (only successful after creating and stopping a schedule)
 * @param  {string} id id of schedule
 */
SchM.restartSchedule = function(id) {
  if (_schedules.getObject(id) !== 'undefined') {
    _schedules.getObject(id).restart();
  }
}


/**
 * Sets/Resets a schedule time
 * @param {string} id   id of schedule
 * @param {number} time schedule time in seconds
 */
SchM.setScheduleTime = function(id, time) {
  if (_schedules.getObject(id) !== 'undefined') {
    _schedules.getObject(id).setTime(time);
  }
}


/***********************************************************************
  Class
 ***********************************************************************/

export function SchM() {

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /***********************************************************************
    Public Instance Function
   ***********************************************************************/
}



/***********************************************************************
  Private Class
 ***********************************************************************/

/**
 * Private schedule class
 */
function Schedule() {

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  /**
   * Variable containing the callback function
   * @type {Function}
   */
  var _cycFunc = function() {};

  /**
   * Variable containing the schedule parameters
   * @type {Object}
   */
  var _cycFuncParams = {
    time: 'init',
    param: 'init'
  };

  /**
   * Schedule Id
   * @type {Object}
   */
  var _schedId = {};

  /**
   * Function call blocker
   * @type {Boolean}
   */
  var _blocKCall = false;


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/


  /**
   * Calls the callback function if last call is finished
   */
  var _asyncCallFunc = async function() {
    if (!_blocKCall) {
      _blocKCall = true;
      _cycFunc(_cycFuncParams.param);
      _blocKCall = false;
    }
  }


  /**
   * creates a schedule
   */
  var _createSch = function() {
    _schedId = Meteor.setInterval(_asyncCallFunc, _cycFuncParams.time * 1000);
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  /**
   * Creates the schedule
   * @param {number} time                     schedule time in seconds
   * @param {function} cyclicFunction         callback function that will be executed
   * @param {what ever} cyclicFunctionParam   parameters of callback function
   */
  this.createSchedule = function(time, cyclicFunction, cyclicFunctionParam) {
    _cycFunc = cyclicFunction;
    _cycFuncParams.time = time;
    _cycFuncParams.param = cyclicFunctionParam;
    _createSch();
  }


  /**
   * Sets/Resets the schedule time
   * @param {number} time                     schedule time in seconds
   */
  this.setTime = function(time) {
    this.stop();
    _cycFuncParams.time = time;
    _createSch();
  }


  /**
   * Removes the schedule
   */
  this.stop = function() {
    Meteor.clearInterval(_schedId);
  }


  /**
   * Restarts the schedule (only successful after creating and stopping a schedule)
   */
  this.restart = function() {
    _createSch();
  }
}
