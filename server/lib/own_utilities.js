/**
 * returns an Json conform return Object
 * @param  {string} error value
 * @param  {string} result value
 * @return {object} object that contains an error and result object
 */
this.errHandle = function(error, result) {
  return { error: error, result: result };
}
