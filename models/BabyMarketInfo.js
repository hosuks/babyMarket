var mongoose = require("mongoose");

// DB schema
var diaperSchema = mongoose.Schema({
    market : { type : String, require : true },
    searchType : { type : Number, require : true },
    dealImgSrc : { type : String, required : true },
    linkUrl : { type : String, required : true },
    price : { type : String, required : true },
    unitPrice : { type : String, required : true },
    regDate : { type : String, require : true }
});

var babyMarketInfo = mongoose.model("babyMarketInfo", diaperSchema);

module.exports = babyMarketInfo;
