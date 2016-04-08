

/***********************************************************************
  Public Static Variable
 ***********************************************************************/

// ClassName.Variable = 'Value';


/***********************************************************************
  private Static Variable
 ***********************************************************************/

// var variable = 'Value';


/***********************************************************************
  Public Static Function
 ***********************************************************************/

// ClassName.function = function(param){
//   return 'Value';
// }


/***********************************************************************
  Private Static Function
 ***********************************************************************/

// var variable = function(param){
//   return 'Value';
// }

/***********************************************************************
  Class
 ***********************************************************************/

export function InstHandler() {

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/
  
  var objArray = new Array();


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/
   
   // this.Variable = 'Value'; 


  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  // var functionName = function(param) {
  //   return 'Value';
  // }

}  

  /***********************************************************************
    Public Instance Function
   ***********************************************************************/


  this.addObj = function(obj, id) {
    var added = false;


    objArray.every(function(element, index, array) {
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

    if (added === false) {
      objArray[objArray.length] = new Object();
      objArray[index]['obj'] = Object.assign({}, obj);
      objArray[index]['id'] = id;
      return true;
    }

    return false;
  }


  this.removeObj = function(id) {
    var found = false;
    
    var idx = objArray.findIndex(function(element, index, array){
      if(element['id'] === id)
        found = true;
        return true;
    });

    if(found === true){
      objArray.delete(idx);
      return true;
    }

    return false;
  }


  this.getObj = function(id){
    var found = false;
    
    var idx = objArray.findIndex(function(element, index, array){
      if(element['id'] === id)
        found = true;
        return true;
    });

    if(found === true){
      return objArray[idx];
    }

    return 'undefined';
  }

}

