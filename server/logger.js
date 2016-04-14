import { SchM } from '../imports/tools/SchM.js';

winston = Meteor.npmRequire('winston');



var createFileLogger = function(path, fileName) {
  return new winston.transports.File({
    timestamp: timeFormat,
    formatter: messageFormat,
    filename: path + fileName,
    json: false

  })
}


var timeFormat = function() {
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
      ret += '0' + tmp;
    } else {
      ret += '00' + tmp;
    }
  } else {
    ret += tmp;
  }

  return ret;
}


var createFileName = function() {
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


  return ret + '.log';
}


var messageFormat = function(options) {
  return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') +
    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
}


var _console = new winston.transports.Console({
  timestamp: timeFormat, // function pointer
  formatter: messageFormat
})


var _file = createFileLogger('../../../', createFileName());


logger = new winston.Logger({
  transports: [
    _console,
    _file
  ]
});




SchM.createSchedule('changeLogName', 'every 50 secs', function() {

  _file = createFileLogger('../../../', createFileName());
  logger = new winston.Logger({
    transports: [
      _console,
      _file
    ]
  })
});
