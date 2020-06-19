var express = require("express");
var router  = express.Router();

var Movie = require("./../models/Film")

router.get('/', (req,res)=>{
  Movie.find({}).then(movies =>{
    res.render("index.html", {movies : movies});
  });
});


router.get("/new", (req,res)=>{
  var movie = new Movie();
  res.render("edit.html", {movie : movie, endpoint : "/"});
});

router.get("/edit/:id", (req,res)=>{
  Movie.findById(req.params.id).then(movie=>{
    res.render("edit.html", {movie : movie, endpoint: "/"+movie._id.toString()});
  });
});

router.get('/:id', (req,res)=>{
  Movie.findById(req.params.id).then(movie => {
      res.render('show.html', {movie : movie});
  }, res => res.status(500).send(err))
});

router.post("/:id?", (req,res)=>{
  new Promise((resolve, reject)=>{
    if(req.params.id){
      Movie.findById(req.params.id).then(resolve, reject);
    }
    else{
      resolve(new Movie());
    }
  }).then(movie =>{
      movie.title = req.body.titleMovie;
      movie.producer = req.body.producerMovie;
      movie.year = req.body.yearMovie;
      movie.description = req.body.descriptionMovie;
      movie.poster = req.body.posterMovie;
      movie.scene = req.body.sceneMovie;
      movie.actors = req.body.actorMovie;


      var elements = [];
      if(req.body.diffusionMovieDate!=undefined){
        for(let i = 0; i<req.body.diffusionMovieDate.length ; i++){
          elements.push({date : req.body.diffusionMovieDate[i], reservation : req.body.diffusionMovieReservation[i], max_places : req.body.diffusionMovieMaxPlaces[i]});
        }
      }


      movie.diffusion = elements;


      movie.limite_age = req.body.limite_age;
      return movie.save();
  }).then(()=>{
    res.redirect("/");
  }, err => console.log(err));
});



module.exports = router;
