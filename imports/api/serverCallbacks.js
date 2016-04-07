import {counterServer} from '../tools/TaskM.js';


Meteor.methods({
	srvClbk_getData: function(){
		this.unblock();
		return counterServer;
	}
})