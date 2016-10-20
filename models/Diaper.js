var mongoose = require("mongoose");

// DB schema
var diaperSchema = mongoose.Schema({
  dealImgSrc : { type : Array, required : false },
  title : { type : Array, required : false },
  price : { type : Array, required : false },
  market : { type : String, require : true },
  regDate: { type : String, require : true }
});

var Diaper = mongoose.model("diaper", diaperSchema);

module.exports = Diaper;
