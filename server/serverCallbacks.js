import{SchM} from '../imports/tools/SchM.js';
import{KrakenApi} from '../imports/api/KrakenApi.js';




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
		this.unblock();
		SchM.stopSchedule(id);
	},

	restartSchedule: function(id){
		this.unblock();
		SchM.restartSchedule(id);
	},

	getServerTime: function(modus){
		this.unblock();
		return KrakenApi.getServerTime(modus);
	}
});