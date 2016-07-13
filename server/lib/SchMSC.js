/**
 * @description:
 * Manages SyncCron schedules
 *
 * 
 * - dependencies:
 *    InstHandler.js v1.4
 *    SyncedCron (meteor add percolate:synced-cron)
 *    later.js (meteor add voidale:later-js-tz)
 *    
 * - static only module
 *
 * 
 * @author Atzen
 * @version 1.1.0
 *
 * 
 * CHANGES:
 * 12-Apr-2016 : Initial version
 * 16-Apr-2016 : added '_' prefix to private statements
 * 24-May-2016 : added possibility to forward parameters to callback function
 * 05-July-2016 : added undefined check in schedules functions
 * 13-July-2016 : changed name from SchM to SchMSC
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
 * Allows to configure the underlying SyncedCron system
 * @param {Object} config parameter of SyncedCron.config function
 */
SchMSC.setSyncedCronConfig = function(config) {
  SyncedCron.config(config);
}


/**
 * Starts all schedules (has to be called to start scheduling)
 */
SchMSC.startSchedules = function() {
  SyncedCron.start();
}


/**
 * Removes all schedules
 */
SchMSC.removeSchedules = function() {
  SyncedCron.stop();
  _schedules.clear();
}


/**
 * Stops all schedules
 */
SchMSC.stopSchedules = function() {
  SyncedCron.pause();
}


/**
 * Creates a schedule
 * @param {string} id               id of schedule
 * @param {string} time             schedule time in later.parse.text format (http://bunkat.github.io/later/parsers.html#overview)
 * @param {function} cyclicFunction callback function that will be executed
 */
SchMSC.createSchedule = function(id, time, cyclicFunction, cyclicFunctionParam) {
  /* check error */
  var tmp = later.parse.text(time);
  if (tmp.error != -1) return false;

  _schedules.setObject(id, new Schedule());
  _schedules.getObject(id).createSchedule(id, time, cyclicFunction, cyclicFunctionParam);

  return true;
}


/**
 * Removes a schedule
 * @param  {string} id id of schedule
 */
SchMSC.removeSchedule = function(id) {
  if (_schedules.getObject(id) !== 'undefined') {
    _schedules.getObject(id).stop();
    _schedules.removeObject(id);
  }
}


/**
 * Stops a schedule
 * @param  {string} id id of schedule
 */
SchMSC.stopSchedule = function(id) {
  if (_schedules.getObject(id) !== 'undefined') {
    _schedules.getObject(id).stop();
  }
}


/**
 * Restarts a schedule (only successful after creating and stopping a schedule)
 * @param  {string} id id of schedule
 */
SchMSC.restartSchedule = function(id) {
  if (_schedules.getObject(id) !== 'undefined') {
    _schedules.getObject(id).restart();
  }
}


/**
 * Sets/Resets a schedule time
 * @param {string} id   id of schedule
 * @param {string} time schedule time in later.parse.text format (http://bunkat.github.io/later/parsers.html#overview)
 */
SchMSC.setScheduleTime = function(id, time) {
  if (_schedules.getObject(id) !== 'undefined') {
    _schedules.getObject(id).setTime(time);
  }
}


/***********************************************************************
  Class
 ***********************************************************************/

export function SchMSC() {

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
    _id: 'init',
    _time: 'init',
    _param: 'init'
  };


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /**
   * creates a schedule
   */
  var _createSch = function() {

    SyncedCron.add({
      name: _cycFuncParams._id, // set schedule name

      schedule: function(parser) {
        return parser.text(_cycFuncParams._time) // set schedule time
      },

      job: function() {
        _cycFunc(_cycFuncParams._param); // set callback function
      }
    });
  }


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  /**
   * Creates the schedule
   * @param {string} id                       id of schedule
   * @param {string} time                     schedule time in later.parse.text format (http://bunkat.github.io/later/parsers.html#overview)
   * @param {function} cyclicFunction         callback function that will be executed
   * @param {what ever} cyclicFunctionParam   parameters of callback function
   */
  this.createSchedule = function(id, time, cyclicFunction, cyclicFunctionParam) {
    _cycFunc = cyclicFunction;
    _cycFuncParams._id = id;
    _cycFuncParams._time = time;
    _cycFuncParams._param = cyclicFunctionParam;

    _createSch();
  }


  /**
   * Sets/Resets the schedule time
   * @param  {string} id id of schedule
   */
  this.setTime = function(time) {
    this.stop(_cycFuncParams._id);
    _cycFuncParams._time = time;
    _createSch();
  }


  /**
   * Removes the schedule
   */
  this.stop = function() {
    SyncedCron.remove(_cycFuncParams._id);
  }


  /**
   * Restarts the schedule (only successful after creating and stopping a schedule)
   */
  this.restart = function() {
    _createSch();
  }
}
