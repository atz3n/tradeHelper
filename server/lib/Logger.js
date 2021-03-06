/**
 * @description:
 * Wrapper class for winston logger
 *
 * 
 * - dependencies:
 *     InstHandler.js
 *     winston (https://meteorhacks.com/logging-support-for-meteor.html)
 *     winston-mongodb (https://www.npmjs.com/package/winston-mongodb)
 * 
 * 
 * @author Atzen
 * @version 0.2.2
 *
 * 
 * CHANGES:
 * 15-Apr-2016 : Initial version
 * 19-July-2016 : BugFix: setDailyFileLogger() did not create daily schedule
 * 09-Jan-2017 : Added recursive folder creation
 * 01-Feb-2017 : setConfig function now has effect while logger is running
 * 03-Mar-2017 : changed daily file build to 00:01 for correct name handling
 */


import { InstHandler } from './InstHandler.js';
import { SchMSC } from './SchMSC.js';


/***********************************************************************
  Private Static Variable
  ***********************************************************************/

var winston = Meteor.npmRequire('winston');
Meteor.npmRequire('winston-mongodb').MongoDB;


/***********************************************************************
  Public Static Variable
  ***********************************************************************/

Logger.ConfigDefault = {
  viewTime: true,
  viewLevel: true,
  cnslLevel: 'info',
  fileLevel: 'info',
  dbLevel: 'info'
}


Logger.DummyLogger = {
  setConfig: function(dummy) {},
  setFileLogger: function(dummy, dummy) {},
  setDailyFileLogger:  function(dummy, dummy, dummy) {},
  setConsoleLogger: function() {},
  setDatabaseLogger: function() {},
  removeFileLogger: function() {},
  removeDailyFileLogger: function() {},
  removeConsoleLogger: function() {},
  removeDatabaseLogger: function() {},
  verbose: function(dummy) {},
  debug: function(dummy) {},
  info: function(dummy) {},
  warn: function(dummy) {},
  error: function(dummy) {}
}


/***********************************************************************
  Private Static Function
  ***********************************************************************/

var _timeFormat = function() {
  var date = new Date();


  var ret = date.getFullYear() + '-';
  var tmp = 0;

  /* Month */
  tmp = date.getMonth() + 1;
  if (tmp < 10) ret += '0' + tmp;
  else ret += tmp;
  ret += '-';

  /* Day */
  tmp = date.getDate();
  if (tmp < 10) ret += '0' + tmp;
  else ret += tmp;
  ret += '_';

  /* Hour */
  tmp = date.getHours();
  if (tmp < 10) ret += '0' + tmp;
  else ret += tmp;
  ret += ':';

  /* Minutes */
  tmp = date.getMinutes();
  if (tmp < 10) ret += '0' + tmp;
  else ret += tmp;
  ret += ':';

  /* Seconds */
  tmp = date.getSeconds();
  if (tmp < 10) ret += '0' + tmp;
  else ret += tmp;
  ret += '.';

  /* Milliseconds */
  tmp = date.getMilliseconds();
  if (tmp < 100) {
    if (tmp < 10) {
      ret += '00' + tmp;
    } else {
      ret += '0' + tmp;
    }
  } else {
    ret += tmp;
  }

  return ret;
}


var _createFileName = function(suffix) {
  var date = new Date();


  var ret = date.getFullYear() + '-';
  var tmp = 0;

  var sfx = '';
  if (typeof suffix !== 'undefined') {
    sfx = suffix;
  }


  /* Month */
  tmp = date.getMonth() + 1;
  if (tmp < 10) ret += '0' + tmp;
  else ret += tmp;
  ret += '-';

  /* Day */
  tmp = date.getDate();
  if (tmp < 10) ret += '0' + tmp;
  else ret += tmp;


  return ret + sfx + '.log';
}


/***********************************************************************
  Public Static Function
  ***********************************************************************/

/***********************************************************************
  Class
  ***********************************************************************/

export function Logger(name) {

  /***********************************************************************
    Inheritances
    ***********************************************************************/

  /***********************************************************************
    Private Instance Variable
    ***********************************************************************/

  var _name = name;

  var _consoleLg = null;
  var _fileLg = null;
  var _dbLg = null;

  var _logger = null;

  var _config = Object.assign({}, Logger.ConfigDefault);

  var _db = null;
  var _dbCreated = false;

  var _dFileLgSettings = null;
  var _fileLgSettings = null;


  /***********************************************************************
    Public Instance Variable
    ***********************************************************************/

  /***********************************************************************
    Private Instance Function
    ***********************************************************************/

  var _messageFormat = function(options) {
    var tmp = '';

    if (_config.viewTime && _config.viewLevel) {
      tmp = options.timestamp() + ' - ' + options.level + ': ';
    } else {
      if (_config.viewTime) {
        tmp = options.timestamp() + ': ';
      }
      if (_config.viewLevel) {
        tmp = options.level.toUpperCase() + ': ';
      }
    }

    return tmp + (undefined !== options.message ? options.message : '') +
      (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
  }


  function mkdirSyncRecursive(dir) {
    var path = Npm.require('path');
    var fs = Npm.require('fs');

    var baseDir = path.dirname(dir);

    // Base dir exists, no recursion necessary
    if (fs.existsSync(baseDir)) {
      fs.mkdirSync(dir, parseInt('0777', 8));
      return;
    }

    // Base dir does not exist, go recursive
    mkdirSyncRecursive(baseDir);

    // Base dir created, can create dir
    fs.mkdirSync(dir, parseInt('0777', 8));
  }


  var _createFileLogger = function(path, fileName) {
    var fs = Npm.require('fs');
    if (!fs.existsSync(path)) mkdirSyncRecursive(path);

    _fileLg = new winston.transports.File({
      name: _name + 'file',
      level: _config.fileLevel,
      timestamp: _timeFormat,
      formatter: _messageFormat,
      filename: path + fileName,
      json: false
    })
  }


  var _createConsoleLogger = function() {
    _consoleLg = new winston.transports.Console({
      name: _name + 'cnsl',
      level: _config.cnslLevel,
      timestamp: _timeFormat, // function pointer
      formatter: _messageFormat,
    })
  }


  var _createDatabaseLogger = function() {
    if (_dbCreated === false) {
      _db = new Mongo.Collection(_name + 'logs');
      _dbCreated = true;
    }

    _dbLg = new winston.transports.MongoDB({
      name: _name + 'db',
      level: _config.dbLevel,
      db: process.env.MONGO_URL,
      collection: _name + 'logs'
    })
  }


  var _createLogger = function() {

    var tmp = new InstHandler()

    if (_consoleLg !== null) {
      tmp.setObject('1', _consoleLg);
    }

    if (_fileLg !== null) {
      tmp.setObject('2', _fileLg);
    }

    if (_dbLg !== null) {
      tmp.setObject('3', _dbLg);
    }

    _logger = new winston.Logger({
      transports: tmp.getObjects()
    });
  }

  /**
   * Merges two Objects where properties of object1 will be overwritten if they have the same name
   * @param  {Object} object1 an Object
   * @param  {Object} object2 another Object
   * @return {Object}         merged Object
   */
  var _mergeObjects = function(object1, object2) {
    var tmp = {};
    for (var attrname in object1) { tmp[attrname] = object1[attrname]; }
    for (var attrname in object2) { tmp[attrname] = object2[attrname]; }
    return tmp;
  }


  /***********************************************************************
    Public Instance Function
    ***********************************************************************/

  this.setConfig = function(config) {
    _config = mergeObjects(_config, config);

    if(_consoleLg !== null) {
      this.removeConsoleLogger();
      this.setConsoleLogger();
    }

    if(_dFileLgSettings !== null && _fileLg !== null) {
      this.removeDailyFileLogger();
      this.setDailyFileLogger(_dFileLgSettings.scheduleName, _dFileLgSettings.path, _dFileLgSettings.suffix);
    } 

    else if(_fileLgSettings !== null && _fileLg !== null) {
      this.removeFileLogger();
      this.setFileLogger(filename, path);
    } 

    if(_dbLg !== null) {
      this.removeDatabaseLogger();
      this.setDatabaseLogger();
    }
  }


  this.setFileLogger = function(filename, path) {
    _fileLgSettings = {filename: filename, path: path};
    _createFileLogger(path, filename);
    _createLogger();
  }


  this.setDailyFileLogger = function(scheduleName, path, suffix) {
    _dFileLgSettings = {scheduleName: scheduleName, path: path, suffix: suffix};
    _createFileLogger(path, _createFileName(suffix));
    _createLogger();

    // return SchMSC.createSchedule(scheduleName, 'every 1 min', function() {
    return SchMSC.createSchedule(scheduleName, 'at 00:01', function() {
      _createFileLogger(path, _createFileName(suffix));
      _createLogger();
    });
  }


  this.setConsoleLogger = function() {
    _createConsoleLogger();
    _createLogger();
  }


  this.setDatabaseLogger = function() {
    _createDatabaseLogger();
    _createLogger();
  }


  this.removeFileLogger = function() {
    _fileLg = null;
    _createLogger();
  }


  this.removeDailyFileLogger = function() {
    SchMSC.removeSchedule(_dFileLgSettings.scheduleName);
    _fileLg = null;
    _createLogger();
  }


  this.removeConsoleLogger = function() {
    _consoleLg = null;
    _createLogger();
  }


  this.removeDatabaseLogger = function() {
    _dbLg = null;
    _createLogger();
  }


  this.debug = function(message) {
    _logger.debug('  ' + message);
  }


  this.verbose = function(message) {
    _logger.verbose(message);
  }


  this.info = function(message) {
    _logger.info('   ' + message);
  }


  this.warn = function(message) {
    _logger.warn('   ' + message);
  }


  this.error = function(message) {
    _logger.error('  ' + message);
  }


  this.getLogger = function() {
    return _logger;
  }


  this.getDatabase = function() {
    return _db;
  }

}
