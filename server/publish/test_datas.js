Meteor.publish("test_datas", function() {
	return TestDatas.find({ownerId:this.userId}, {});
});

Meteor.publish("test_datas_empty", function() {
	return TestDatas.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("test_data", function(testDataId) {
	return TestDatas.find({_id:testDataId,ownerId:this.userId}, {});
});

