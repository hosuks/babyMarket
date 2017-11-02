var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

// Routes
app.use("/diaper", require("./routes/diaper"));

app.listen(9000, function(){
   console.log('9000 port Server On!');
});
