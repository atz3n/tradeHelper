Meteor.publish("active_datas", function() {
	return ActiveDatas.find({ownerId:this.userId}, {});
});

Meteor.publish("active_datas_admin", function() {
	if(this.userId){
		if(getUserRole(this.userId) === "admin") return ActiveDatas.find({}, {});
	}
});

Meteor.publish("active_data", function(activeDataId) {
	return ActiveDatas.find({_id:activeDataId,ownerId:this.userId}, {});
});

