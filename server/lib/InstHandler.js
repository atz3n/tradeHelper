/**
 * @description:
 * Saves instances into an array and manages them
 *
 * 
 * - no dependencies
 *
 * 
 * @author Atzen
 * @version 1.2.1
 *
 * 
 * CHANGES:
 * 12-Apr-2016 : Initial version
 * 15-Apr-2016 : renamed functions (Obj -> Object)
 *               added getObjects function
 * 02-May-2016 : added getObjectByIdx function
 *               added getObjectsArray function 
 * 03-May-2016 : changed removeObject function
 *             : renamed addObject to setObject function
 *             : added setObjectByIdx function
 * 06-May-2016 : fixed bug in setObject function
 * 08-May-2016 : changed for loop variable declaration
 */


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

/***********************************************************************
  Class
 ***********************************************************************/

export function InstHandler() {

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/

  /**
   * internal array that holds all objects
   * @type {Array}
   */
  var _objArray = new Array();


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  /**
   * adds/sets an object to/from the internal array
   * @param {string} id  id which (will be)/is attached to the object
   * @param {Object} obj object which should be stored
   * @return {bool}      true if successful
   */
  this.setObject = function(id, obj) {
    var added = false;


    /* saves obj in a free element space or overrides it (if same id was found) */
    for (var i = 0; i < _objArray.length; i++) {

      if (_objArray[i] === 'undefined' || _objArray[i]['id'] === id) {
        _objArray[i] = new Object();
        _objArray[i]['obj'] = obj;
        _objArray[i]['id'] = id;
        added = true;
        break;
      }

    }

    /* if no space is available, push obj to the end */
    if (added === false) {
      _objArray[_objArray.length] = new Object();
      _objArray[_objArray.length - 1]['obj'] = obj;
      _objArray[_objArray.length - 1]['id'] = id;
      return true;
    }

    return false;
  }


  /**
   * sets an object from the internal array
   * @param {integer} idx index of object array
   * @param {Object} obj object which should be stored
   */
  this.setObjectByIdx = function(idx, obj) {
    if (idx >= _objArray.length || idx < 0)
      return false

    _objArray[idx]['obj'] = obj;
    return true;
  }


  /**
   * removes an element from the internal array
   * @param  {string} id id of object which should be removed
   * @return {bool}      true if successful
   */
  this.removeObject = function(id) {
    var found = false;

    /* get element index of object */
    var idx = _objArray.findIndex(function(element, index, array) {
      if (element['id'] === id) {
        found = true;
        return true;
      }
    });

    /* delete */
    if (found === true) {
      _objArray[idx] = 'undefined';
      return true;
    }

    return false;
  }


  /**
   * returns an object
   * @param  {string} id id of object which should be returned
   * @return {Object}    object which should be returned (returns 'undefined' if not found)
   */
  this.getObject = function(id) {
    var found = false;

    /* get element index of object */
    var idx = _objArray.findIndex(function(element, index, array) {
      if (element['id'] === id) {
        found = true;
        return true;
      }
    });

    /* return object */
    if (found === true) {
      return _objArray[idx]['obj'];
    }

    return 'undefined';
  }


  /**
   * returns an object selected by its index
   * @param  {integer} index of object which should be returned
   * @return {Object}    object which should be returned (returns 'undefined' if not found)
   */
  this.getObjectByIdx = function(idx) {
    if (typeof _objArray[idx] === 'undefined') {
      return 'undefined';
    }

    return _objArray[idx]['obj'];
  }


  /**
   * clears the internal array (deletes all elements)
   * @return {bool} true if successful
   */
  this.clear = function() {
    _objArray = new Object();
    return true;
  }


  /**
   * Returns all objects in an Array
   * @return {Array} array to be returned
   */
  this.getObjects = function() {
    tmp = new Array();

    for (var i = 0; i < _objArray.length; i++) {
      tmp[i] = _objArray[i]['obj'];
    }

    return tmp;
  }


  /**
   * Returns the entire object array including id's
   * @return {Array} array to be returned
   */
  this.getObjectsArray = function() {
    return _objArray;
  }
}
