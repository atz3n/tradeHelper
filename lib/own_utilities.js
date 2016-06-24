
/**
 * Calculates the percentage difference between two values
 * @param  {string} checkVal value to be checked
 * @param  {string} baseVal  basic value
 * @return {string}          calculated percentage differnce
 */
this.percentage = function(checkVal, baseVal) {
    return ((checkVal - baseVal) / baseVal) * 100;
}


this.cropFracDigits = function(value, numOfFracDigits) {
	return Math.round(value * Math.pow(10, numOfFracDigits)) / Math.pow(10, numOfFracDigits);
}