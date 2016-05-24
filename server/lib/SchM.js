/**
 * @description:
 * Manages SyncCron schedules
 *
 * 
 * - dependencies:
 *    InstHandler.js
 *    SyncedCron (meteor add percolate:synced-cron)
 *    later.js (meteor add voidale:later-js-tz)
 *    
 * - static only module
 *
 * 
 * @author Atzen
 * @version 1.0.1
 *
 * 
 * CHANGES:
 * 12-Apr-2016 : Initial version
 * 16-Apr-2016 : added '_' prefix to private statements
 * 24-May-2016 : added possibility to forward parameters to callback function
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
SchM.setSyncedCronConfig = function(config){
  SyncedCron.config(config);
}


/**
 * Starts all schedules (has to be called to start scheduling)
 */
SchM.startSchedules = function() {
  SyncedCron.start();
}


/**
 * Removes all schedules
 */
SchM.removeSchedules = function() {
  SyncedCron.stop();
  _schedules.clear();
}


/**
 * Stops all schedules
 */
SchM.stopSchedules = function() {
  SyncedCron.pause();
}


/**
 * Creates a schedule
 * @param {string} id               id of schedule
 * @param {string} time             schedule time in later.parse.text format (http://bunkat.github.io/later/parsers.html#overview)
 * @param {function} cyclicFunction callback function that will be executed
 */
SchM.createSchedule = function(id, time, cyclicFunction, cyclicFunctionParam) {
  /* check error */
  var tmp = later.parse.text(time);
  if(tmp.error != -1) return false;
  
  _schedules.setObject(id, new Schedule());
  _schedules.getObject(id).createSchedule(id, time, cyclicFunction, cyclicFunctionParam);
  
  return true; 
}


/**
 * Removes a schedule
 * @param  {string} id id of schedule
 */
SchM.removeSchedule = function(id) {
  _schedules.getObject(id).stop();
  _schedules.removeObject(id);
}


/**
 * Stops a schedule
 * @param  {string} id id of schedule
 */
SchM.stopSchedule = function(id) {
  _schedules.getObject(id).stop();
}


/**
 * Restarts a schedule (only successful after creating and stopping a schedule)
 * @param  {string} id id of schedule
 */
SchM.restartSchedule = function(id) {
  _schedules.getObject(id).restart();
}


/**
 * Sets/Resets a schedule time
 * @param {string} id   id of schedule
 * @param {string} time schedule time in later.parse.text format (http://bunkat.github.io/later/parsers.html#overview)
 */
SchM.setScheduleTime = function(id, time) {
  _schedules.getObject(id).setTime(time);
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
  var _cycFunc = function(){};

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
