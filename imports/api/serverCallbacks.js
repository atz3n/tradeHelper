import {counterServer} from '../tools/scheduler.js';


Meteor.methods({
	srvClbk_getData: function(){
		this.unblock();
		return counterServer;
	}
})