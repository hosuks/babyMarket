var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var moment = require("moment");
var bodyParser = require("body-parser");
var Diaper = require("../models/Diaper");


router.route("/:keyword").get(function(req, res){
  var wmpUrl = "http://www.wemakeprice.com/search?search_cate=top&search_keyword=" + encodeURIComponent(req.params.keyword) + "&_service=5&_type=3";
  var wmpDealImg = [];
  var wmpTitle = [];
  var wmpPrice = [];
  var wmpLinkUrl = [];

  // WMP
  request(wmpUrl, function(error, response, body){
      if (error) throw error;

      var $ = cheerio.load(body);
      var dealImg = $("img.lazy");
      var title = $("strong.tit_desc");
      var price = $("span.sale");
      var linkUrl = $("span.type03");

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

      linkUrl.each(function(){
          wmpLinkUrl.push('http://www.wemakeprice.com/' + $(this).find('a').attr('href'));
      });

      var cpUrl = "http://www.coupang.com/np/search?q=" + encodeURIComponent(req.params.keyword) + "&channel=user";
      var cpDealImg = [];
      var cpTitle = [];
      var cpPrice = [];
      var cpLinkUrl = [];

      // COUPANG
      request(cpUrl, function(error, response, body){
          if (error) throw error;

          var $ = cheerio.load(body);
          var dealImg = $("dt.image");
          var title = $("dd.name");
          var price = $("span.rocket");
          var linkUrl = $("li.search-product");

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

          linkUrl.each(function(){
              cpLinkUrl.push('http://www.coupang.com' + $(this).find('a').attr('href'));
          });

          var tmUrl = "http://search.ticketmonster.co.kr/search/?keyword=" + encodeURIComponent(req.params.keyword) + "&thr=ts";
          var tmDealImg = [];
          var tmTitle = [];
          var tmPrice = [];
          var tmLinkUrl = [];

          // TMON
          request(tmUrl, function(error, response, body){
              if (error) throw error;

              var $ = cheerio.load(body);
              var dealImg = $("div.deal_item_thumb");
              var title = $("strong.deal_item_title");
              var price = $("span.deal_item_price");
              var linkUrl = $("a.deal_item_anchor");

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
                  tmPrice.push($(this).find('em').first().text()+"원");
              });

              linkUrl.each(function(){
                  tmLinkUrl.push($(this).attr('href')+"원");
              });

              res.render("diaper", {
                                     wmpDealImg:wmpDealImg, wmpTitle:wmpTitle, wmpPrice:wmpPrice, wmpLinkUrl:wmpLinkUrl,
                                     cpDealImg:cpDealImg, cpTitle:cpTitle, cpPrice:cpPrice, cpLinkUrl:cpLinkUrl,
                                     tmDealImg:tmDealImg, tmTitle:tmTitle, tmPrice:tmPrice, tmLinkUrl:tmLinkUrl,
                                     keyword:req.params.keyword
                                   });
      });
    });
  });
});

module.exports = router;
