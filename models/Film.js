var mongoose = require("mongoose");

var diffusionSchema = new mongoose.Schema({
  date : Date,
  reservation : Number,
  max_places : Number
});

var filmSchema = new mongoose.Schema({
  title : String,
  producer : String,
  year : String,
  description : String,
  poster : String,
  scene : String,
  actors : [String],
  diffusion :[diffusionSchema],
  limite_age : Number
});


var Film = mongoose.model("films", filmSchema);

module.exports = Film;
