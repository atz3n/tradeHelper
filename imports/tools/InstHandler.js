import { KrakenPlatform } from './KrakenPlatform.js';




export function InstHandler() {

  this.Inst = new Array();




  this.add = function(obj) {
    var added = false;
    var idx = 0;
    Inst.every(function(element, index, array) {
      if (element !== 'undefined') {
        array.index[index] = obj;
        added = true;
        idx = index;
        return;
      }
    });

    if (added === false) {
      Inst.push(obj);
      idx = Inst.length - 1;
    }
  }

  this.delete = function(index) {
    if (index >= Inst.length - 1)
      return false;

    Inst.delete(index);
    return true;
  }
}
