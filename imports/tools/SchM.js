import {InstHandler} from './InstHandler.js';


/***********************************************************************
  Public Static Variable
 ***********************************************************************/

/***********************************************************************
  private Static Variable
 ***********************************************************************/

/***********************************************************************
  Public Static Function
 ***********************************************************************/

SchM.startSchedules = function(){
  SyncedCron.start();
}

SchM.stopSchedules = function(){
  SyncedCron.stop();
}

SchM.pauseSchedules = function(){
  SyncedCron.pause();
}


/***********************************************************************
  Private Static Function
 ***********************************************************************/

/***********************************************************************
  Class
 ***********************************************************************/

var function SchM() {

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/
  
  var schedules = new InstHandler();


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/
   
  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  this.addSchedule = function(cyclicFunction, id, time){
    
    schedules.addObj(new Schedule(), id);
    schedules.getObj(id).setCyclicFunction(cyclicFunction, id, time);
  }


  this.removeSchedule = function(id){
    schedules.getObj(id).remove();
    schedules.delete(id);
  }


  this.setScheduleTime = function(time){
    schedules.getObj(id).setTime(time);
  }
}



/***********************************************************************
  Private Class
 ***********************************************************************/

var function Schedule(id, time, cyclicFunction) {

  /***********************************************************************
    Private Instance Variable
   ***********************************************************************/
  
  var cycFunc = 'init';

  var cycFuncParams = {
    _id = 'init',
    _time = 'init'
  };


  /***********************************************************************
    Public Instance Variable
   ***********************************************************************/

  /***********************************************************************
    Private Instance Function
   ***********************************************************************/

  /**
   * [addCycFunc description]
   */
  var addCycFunc(){
    SyncedCron.add({
    name: cycFuncParams._id,
    schedule: function(parser) {
      return parser.text(cycFuncParams._time)
    },
    job: function() {
      cycFunc();
    }
  }  


  /***********************************************************************
    Public Instance Function
   ***********************************************************************/

  /**
   * [setCyclicFunction description]
   * @param {[type]} cyclicFunction [description]
   * @param {[type]} id             [description]
   * @param {[type]} time           [description]
   */
  this.setCyclicFunction = function(cyclicFunction, id, time){
    cycFunc = cyclicFunction; 
    cycFuncParams._id = id;
    cycFuncParams._time = id;

    addCycFunc();
  }
  

  /**
   * [setTime description]
   * @param {[type]} time [description]
   */
  this.setTime = function(time){
    SyncedCron.remove(cycFuncParams._id);
    cycFuncParams._time = time;
    addCycFunc();
  }


  /**
   * [remove description]
   * @return {[type]} [description]
   */
  this.remove = function(){
    SyncedCron.remove(cycFuncParams._id);
  }
}
