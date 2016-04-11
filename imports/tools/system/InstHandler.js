/**
 * @description:
 * Saves instances into an array and manages them
 *
 * - no dependencies
 * 
 * @author Atzen
 * @version 1.0
 * 
 * CHANGES:
 * 12-Apr-2016 : Initial version
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
  var objArray = new Array();


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
   * adds an object to the internal array
   * @param {string} id  id which will be attached to the object
   * @param {Object} obj object which should be stored
   * @return {bool}      true if successful
   */
  this.addObj = function(id, obj) {
    var added = false;


    /* saves obj in a free element space or overrides it (if same id was found) */
    objArray.every(function(element, index, array) {
    	var idx = 0;
      if(index < array.length){
        if (element === 'undefined' || array[index]['id'] === id) {
          array[index] = new Object();
          array[index]['obj'] = Object.assign({}, obj);
          array[index]['id'] = id;
          added = true;
          return true;
        }
      }
    });

    /* if no space is available, push obj to the end */
    if (added === false) {
      objArray[objArray.length] = new Object();
      objArray[objArray.length - 1]['obj'] = Object.assign({}, obj);
      objArray[objArray.length - 1]['id'] = id;
      return true;
    }

    return false;
  }


  /**
   * removes an element from the internal array
   * @param  {string} id id of object which should be removed
   * @return {bool}      true if successful
   */
  this.removeObj = function(id) {
    var found = false;
    

    /* get element index of object */
    var idx = objArray.findIndex(function(element, index, array){
      if(element['id'] === id)
        found = true;
        return true;
    });

    /* remove element */
    if(found === true){
      objArray.delete(idx);
      return true;
    }

    return false;
  }


  /**
   * returns an object
   * @param  {string} id id of object which should be returned
   * @return {Object}    object which should be returned (returns 'undefined' if not found)
   */
  this.getObj = function(id){
    var found = false;
    
    /* get element index of object */
    var idx = objArray.findIndex(function(element, index, array){
      if(element['id'] === id){
        found = true;
        return true;
      }
    });

    /* return object */
    if(found === true){
      return objArray[idx]['obj'];
    }

    return 'undefined';
  }


  /**
   * clears the internal array (deletes all elements)
   * @return {bool} true if successful
   */
  this.clear = function(){
  	objArray = new Object();
  	return true;
  }
}

