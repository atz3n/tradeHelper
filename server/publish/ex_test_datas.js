Meteor.publish("ex_test_datas", function() {
	return ExTestDatas.find({ownerId:this.userId}, {});
});

Meteor.publish("ex_test_datas_empty", function() {
	return ExTestDatas.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("ex_test_data", function(exTestDataId) {
	return ExTestDatas.find({_id:exTestDataId,ownerId:this.userId}, {});
});

