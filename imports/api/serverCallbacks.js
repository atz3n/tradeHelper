import {counterServer} from '../tools/system/tasks.js';
import {SchM} from '../tools/system/SchM.js';

Meteor.methods({
	srvClbk_getData: function(){
		this.unblock();
		return counterServer;
	},

	setScheduleTime: function(id, time){
		this.unblock();
		SchM.setScheduleTime(id, time);
	},

	stopSchedule: function(id){
		SchM.stopSchedule(id);
	},

	restartSchedule: function(id){
		SchM.restartSchedule(id);
	},
})