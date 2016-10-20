var mongoose = require("mongoose");

// DB schema
var babyMarketSchema = mongoose.Schema({
  token : { type : String, require : true },
  regDate: { type : String, require : true }
});

var BabyMarket = mongoose.model("babyMarket", babyMarketSchema);

module.exports = BabyMarket;
