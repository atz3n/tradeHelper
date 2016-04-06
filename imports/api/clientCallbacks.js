import {test} from '../ui/body.js';


Meteor.ClientCall.methods({
	cltClbk_test: function(counterVal){
		test.set(counterVal);
		return true;
	}
});