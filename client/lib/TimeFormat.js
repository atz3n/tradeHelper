/**
 * @description:
 * <Description>
 *
 * 
 * <Optional informations>
 *
 * 
 * @author Atzen
 * @version 1.0.0
 *
 * 
 * CHANGES:
 * 02-Jun-2015 : Initial version
 */


// import { Instance } from '../dir/example.js';
// import './example.js';


/***********************************************************************
  Private Static Variable
 ***********************************************************************/

/***********************************************************************
  Public Static Variable
 ***********************************************************************/

/***********************************************************************
  Private Static Function
 ***********************************************************************/

/***********************************************************************
  Public Static Function
 ***********************************************************************/

TimeFormat.getSeconds = function(date) {
  var ret = '';

  /* Seconds */
  var tmp = date.getSeconds();
  if (tmp < 10) ret = '0' + tmp;
  else ret = tmp;

  return ret;
}


TimeFormat.getMinutes = function(date) {
  var ret = '';

  /* Minutes */
  var tmp = date.getMinutes();
  if (tmp < 10) ret = '0' + tmp;
  else ret = tmp;

  return ret;
}


TimeFormat.getHours = function(date) {
  var ret = '';

  /* Hour */
  var tmp = date.getHours();
  if (tmp < 10) ret = '0' + tmp;
  else ret = tmp;

  return ret;
}


TimeFormat.getDay = function(date) {
  var ret = '';

  /* Day */
  var tmp = date.getDate();
  if (tmp < 10) ret = '0' + tmp;
  else ret = tmp;

  return ret;
}


TimeFormat.getMonth = function(date) {
  var ret = '';

  /* Month */
  var tmp = date.getMonth();
  if (tmp < 10) ret = '0' + tmp;
  else ret = tmp;

  return ret;
}


TimeFormat.getYear = function(date) {

  /* Year */
  return date.getFullYear();
}


TimeFormat.getFullDateMs = function(date) {
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


TimeFormat.getFullDate = function(date) {
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

  return ret;
}

/***********************************************************************
  Class
 ***********************************************************************/

export function TimeFormat() {

  /***********************************************************************
    Inheritances
   ***********************************************************************/

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

  /***********************************************************************
    Constructor
   ***********************************************************************/
}
