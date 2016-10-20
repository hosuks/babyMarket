var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var moment = require("moment");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Diaper = require("../models/Diaper");

mongoose.connect(process.env.MONGO_DB); // 1
var db = mongoose.connection;

db.once("open", function(){
  console.log("DB connected");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});

var wmpDealImg = [];
var wmpTitle = [];
var wmpPrice = [];

function readData(req) {
    var wmpUrl = "http://www.wemakeprice.com/search?search_cate=top&search_keyword=" + encodeURIComponent(req.params.keyword) + "&_service=5&_type=3";

    request(wmpUrl, function(error, response, body){
      if (error) throw error;
  console.log(0);
      var $ = cheerio.load(body);
      var dealImg = $("img.lazy");
      var title = $("strong.tit_desc");
      var price = $("span.sale");

      dealImg.each(function(){
          //console.log($(this).attr('original')+"<br>");
          wmpDealImg.push($(this).attr('original'));
      });

      title.each(function(){
          wmpTitle.push($(this).text());
      });

      price.each(function(){
          wmpPrice.push($(this).text());
      });

      //console.log(moment().format('YYYY-MM-DD HH:mm'));
      //res.render("diaper", {wmpDealImg:wmpDealImg, wmpTitle:wmpTitle, wmpPrice:wmpPrice});
      // Diaper.create({dealImgSrc:wmpDealImg, title:wmpTitle, price:wmpPrice, market:'wemakeprice', regDate:moment().format('YYYY-MM-DD HH:mm')}, function(err, wmp){
      //     if(err) {
      //      return res.json(err);
      //     }
      // });
    });

    var cpUrl = "http://www.coupang.com/np/search?q=" + encodeURIComponent(req.params.keyword) + "&channel=user";
    var cpDealImg = [];
    var cpTitle = [];
    var cpPrice = [];

    request(cpUrl, function(error, response, body){
      if (error) throw error;
console.log(1);
      var $ = cheerio.load(body);
      var dealImg = $("dt.image");
      var title = $("dd.name");
      var price = $("span.rocket");

      dealImg.each(function(){
          //console.log("http:" + $(this).find('img').attr('src')+"<br>");
          cpDealImg.push("http:" + $(this).find('img').attr('src'));
      });

      title.each(function(){
          //console.log($(this).text().trim()+"<br>");
          cpTitle.push($(this).text().trim());
      });

      price.each(function(){
          //console.log($(this).parent().find('strong.price-value').text()+"<br>");
          cpPrice.push($(this).parent().find('strong.price-value').text()+"원");
      });
      //res.render("diaper", {cpDealImg:cpDealImg, cpTitle:cpTitle, cpPrice:cpPrice});
    });

    var tmUrl = "http://search.ticketmonster.co.kr/search/?keyword=" + encodeURIComponent(req.params.keyword) + "&thr=ts";
    var tmDealImg = [];
    var tmTitle = [];
    var tmPrice = [];

    request(tmUrl, function(error, response, body){
      if (error) throw error;
console.log(tmUrl);
      var $ = cheerio.load(body);
      var dealImg = $("div.deal_item_thumb");
      var title = $("strong.deal_item_title");
      var price = $("span.deal_item_price");

      dealImg.each(function(){
          // console.log($(this).find('img').attr('src')+"<br>");
          tmDealImg.push($(this).find('img').attr('src'));
      });

      title.each(function(){
          // console.log($(this).text().trim()+"<br>");
          tmTitle.push($(this).text().trim());
      });

      price.each(function(){
          // console.log($(this).find('em').text()+"<br>");
          tmPrice.push($(this).find('em').text()+"원");
      });


    });
console.log(3);
}


router.route("/:keyword").get(function(req, res){

    readData(req, function() {
          res.render("diaper", {});
    });
});

module.exports = router;
