this.ServerDatas = new Mongo.Collection("serverDatas");

if (typeof ServerDatas.findOne() === 'undefined') {
  ServerDatas.insert({
    topicCounter: 0
  });
}

this.serverDataId = ServerDatas.findOne()._id;
