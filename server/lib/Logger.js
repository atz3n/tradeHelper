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
 * @version 0.9.0
 *
 * 
 * CHANGES:
 * 15-Apr-2016 : Initial version
 */


// import { InstHandler } from './InstHandler.js';
// import { SchM } from './SchM.js';


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


  var _createFileLogger = function(path, fileName) {
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
    if(_dbCreated === false){
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


  /***********************************************************************
    Public Instance Function
    ***********************************************************************/

  this.setConfig = function(config) {
    _config = Object.assign({}, config);
  }


  this.setFileLogger = function(filename, path) {
    _createFileLogger(path, filename);
    _createLogger();
  }


  this.setDailyFileLogger = function(scheduleName, path, suffix) {
    _createFileLogger(path, _createFileName(suffix));
    _createLogger();

    return SchM.createSchedule(scheduleName, 'at 00:00', function() {

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


  this.removeDailyFileLogger = function(scheduleName) {
    SchM.removeSchedule(scheduleName);
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
    _logger.debug(message);
  }

  this.verbose = function(message) {
    _logger.verbose(message);
  }

  this.info = function(message) {
    _logger.info(message);
  }

  this.warn = function(message) {
    _logger.warn(message);
  }

  this.error = function(message) {
    _logger.error(message);
  }

  this.getLogger = function() {
    return _logger;
  }

  this.getDatabase = function() {
    return _db;
  }

}
