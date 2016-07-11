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


/**
 * Merges two Objects where properties of object1 will be overwritten if they have the same name
 * @param  {Object} object1 an Object
 * @param  {Object} object2 another Object
 * @return {Object}         merged Object
 */
this.mergeObjects = function(object1, object2) {
  var tmp = {};
  for (var attrname in object1) { tmp[attrname] = object1[attrname]; }
  for (var attrname in object2) { tmp[attrname] = object2[attrname]; }
  return tmp;
}


this.renameObjKey = function(object, oldKey, newKey) {
  if (oldKey !== newKey) {
    Object.defineProperty(object, newKey,
      Object.getOwnPropertyDescriptor(object, oldKey));
    delete object[oldKey];
  }
}
