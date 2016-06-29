/**
 * Calculates the percentage difference between two values
 * @param  {string} checkVal value to be checked
 * @param  {string} baseVal  basic value
 * @return {string}          calculated percentage differnce
 */
this.percentage = function(checkVal, baseVal) {
  return ((checkVal - baseVal) / baseVal) * 100;
}


this.average = function(elementArray) {
  var average = 0;

  for (i in elementArray) average += elementArray[i];
  average /= elementArray.length;

  return average;
}


this.cropFracDigits = function(value, numOfFracDigits) {
  return Math.round(value * Math.pow(10, numOfFracDigits)) / Math.pow(10, numOfFracDigits);
}
