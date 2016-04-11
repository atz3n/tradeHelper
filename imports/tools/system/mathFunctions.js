

/**
 * Calculates the percentage difference between two values
 * @param  {string} checkVal value to be checked
 * @param  {string} baseVal  basic value
 * @return {string}          calculated percentage differnce
 */
function percentage(checkVal, baseVal) {
	return ((checkVal - baseVal) / baseVal) * 100;
}