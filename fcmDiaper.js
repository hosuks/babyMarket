var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var schedule = require("node-schedule");
var BabyMarket = require("./models/BabyMarket");
var FCM = require('fcm-node');

var j = schedule.scheduleJob('0 11 * * *', function(){
  mongoose.connect(process.env.MONGO_DB); // 1
  var db = mongoose.connection;

  db.once("open", function(){
    console.log("DB connected");
  });
  db.on("error", function(err){
    console.log("DB ERROR : ", err);
  });

  var token = new Array();

  BabyMarket.find({}, function(err, babyMarket){
    babyMarket.forEach(function(data){
      token.push(data.token);
    });

    var serverKey = 'AIzaSyAh2QdlpXNK07XmX0F-L2GM3ao7uMGZwF8';
    var fcm = new FCM(serverKey);

    for(var i = 0; i < token.length; i++) {
      var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
          to: token[i],
          collapse_key: 'your_collapse_key',

          notification: {
              title: '기저귀 3대천왕',
              body: '우리 아기 기저귀 최저가를 확인하세요.'
          },

          data: {  //you can send only notification or only data(or include both)
              my_key: 'my value',
              my_another_key: 'my another value'
          }
      };

      fcm.send(message, function(err, response){
          if (err) {
              console.log("Something has gone wrong!");
          } else {
              console.log("Successfully sent with response: ", response);
          }
      });
    }
  });
});
