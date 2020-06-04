var express = require("express");
var mongoose = require("mongoose");
var nunjucks = require("nunjucks");
var bodyParser = require("body-parser");
var multer = require("multer");

var upload = multer({
  dest : __dirname+"/uploads"
});

mongoose.connect("mongodb://localhost:27017/cinema");

require("./models/Film");



var app = express();


app.use(bodyParser.urlencoded());

app.use(upload.single("file"));


app.use("/css", express.static(__dirname+"/node_modules/bootstrap/dist/css"));

app.use("/js", express.static("js"));

app.use("/jquery", express.static(__dirname+"/node_modules/jquery/src"))

app.use("/uploads", express.static(__dirname+"/uploads"));

app.use("/", require("./routes/Film"));



nunjucks.configure("views",{
  autoescape : true,
  express : app
});



console.log("it works on port 3000");
app.listen("3000");
