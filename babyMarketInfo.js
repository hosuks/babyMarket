var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var schedule = require("node-schedule");
var BabyMarket = require("./models/BabyMarketInfo");
var request = require("request");
var cheerio = require("cheerio");

var i = schedule.scheduleJob('49 * * * *', function(){
  mongoose.connect(process.env.MONGO_DB); // 1
  var db = mongoose.connection;

  db.once("open", function(){
      console.log("DB connected");
  });
  db.on("error", function(err){
      console.log("DB ERROR : ", err);
  });

  var wmpUrl = "http://www.wemakeprice.com/search?search_cate=top&search_keyword=" + encodeURIComponent('하기스기저귀') + "&_service=5&_type=3";
  var wmpDealImg = [];
  var wmpPrice = [];
  var wmpLinkUrl = [];

  // WMP
  request(wmpUrl, function(error, response, body){
      if (error) throw error;

      var $ = cheerio.load(body);
      var dealImg = $("img.lazy");
      var price = $("span.sale");
      var linkUrl = $("span.type03");

      dealImg.each(function(){
          //console.log($(this).attr('original')+"<br>");
          wmpDealImg.push($(this).attr('original'));
      });

      price.each(function(){
          wmpPrice.push($(this).text());
      });

      linkUrl.each(function(){
          wmpLinkUrl.push('http://www.wemakeprice.com/' + $(this).find('a').attr('href'));
      });

      var cpUrl = "http://www.coupang.com/np/search?q=" + encodeURIComponent('하기스기저귀') + "&channel=user";
      var cpDealImg = [];
      var cpPrice = [];
      var cpLinkUrl = [];
      var cpUnitPrice = [];

      // COUPANG
      request(cpUrl, function(error, response, body){
          if (error) throw error;

          var $ = cheerio.load(body);
          var dealImg = $("dt.image");
          var price = $("span.rocket");
          var linkUrl = $("li.search-product");
          var unitPrice = $("span.rocket");

          dealImg.each(function(){
              //console.log("http:" + $(this).find('img').attr('src')+"<br>");
              cpDealImg.push("http:" + $(this).find('img').attr('src'));
          });

          price.each(function(){
              //console.log($(this).parent().find('strong.price-value').text()+"<br>");
              cpPrice.push($(this).parent().find('strong.price-value').text()+"원");
          });

          linkUrl.each(function(){
              cpLinkUrl.push('http://www.coupang.com' + $(this).find('a').attr('href'));
          });

          unitPrice.each(function(){
              cpUnitPrice.push($(this).parent().next().find('em').last().text());
          });

          var tmUrl = "http://search.ticketmonster.co.kr/search/?keyword=" + encodeURIComponent('하기스기저귀') + "&thr=ts";
          var tmDealImg = [];
          var tmPrice = [];
          var tmLinkUrl = [];

          // TMON
          request(tmUrl, function(error, response, body){
              if (error) throw error;

              var $ = cheerio.load(body);
              var dealImg = $("div.deal_item_thumb");
              var price = $("span.deal_item_price");
              var linkUrl = $("a.deal_item_anchor");

              dealImg.each(function(){
                  // console.log($(this).find('img').attr('src')+"<br>");
                  tmDealImg.push($(this).find('img').attr('src'));
              });

              price.each(function(){
                  // console.log($(this).find('em').text()+"<br>");
                  tmPrice.push($(this).find('em').first().text()+"원");
              });

              linkUrl.each(function(){
                  tmLinkUrl.push($(this).attr('href')+"원");
              });

console.log(wmpDealImg.length);
              // var dataObject = {
              //     wmpDealImg : wmpDealImg,
              //     wmpPrice : wmpPrice,
              //     wmpLinkUrl : wmpLinkUrl,
              //     cpDealImg : cpDealImg,
              //     cpPrice : cpPrice,
              //     cpLinkUrl : cpLinkUrl,
              //     cpUnitPrice : cpUnitPrice,
              //     tmDealImg : tmDealImg,
              //     tmPrice : tmPrice,
              //     tmLinkUrl : tmLinkUrl
              // };
              // res.send(dataObject);
      });
    });
  });
});
