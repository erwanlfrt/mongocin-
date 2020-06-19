var mongo  = require("mongodb").MongoClient;
var url = "mongodb://localhost/cinema";


function createDatabase(){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		//console.log("Database created!");
		db.close();
	});
}

function createCollection(){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("cinema");
		dbo.createCollection("films", function(err, res){
			if(err) throw err;
			//console.log("Collection created !");
			db.close();
		});
	});
}

function createActorCollection(){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("cinema");
		dbo.createCollection("actors",{
			validator:{
				$jsonSchema:{
					bsonType:"object",
					properties:{
						name : {
							bsonType : "string"
						},
						image : {
							bsonType : "string"
						}
					}
				}
			}
		},function(err, res){
			if(err) throw err;
			//console.log("Collection created !");
			db.close();
		});
	});
}

function addMovie(title, producer, year, description, poster, scene, actors, diffusion,age){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo  = db.db("cinema");
		if(Array.isArray(diffusion)){
			var obj = {title : title, producer : producer,year : year, description : description, poster : poster, scene: scene, actors : [], limite_age : age};
		}
		else{
			var obj = {title : title, producer : producer,year : year, description : description, poster : poster, scene: scene, actors : [],diffusion : {date : diffusion, reservation : 0, max_places : 100}, limite_age : age};
		}

		dbo.collection("films").insertOne(obj, function(err, res){
			if(err) throw err;
			//console.log("1 document inserted");
			db.close();
		});
		actorsId = [];
		for(var i = 0; i<actors.length; i++){
			//console.log("acteur = "+actors[i]);
			dbo.collection("actors").findOne({name : actors[i]}, function(err, result) {
				if (err) throw err;
				if(result != null){
					//console.log("acteur ici = "+result.name);
					addActorToMovie(title, result._id);
				}
				else{
					//console.log("résultat nul pour acteur = "+actors[i]);
					//addActor(actors[i]);
				}
		    db.close();
	  	});
		}


		if(Array.isArray(diffusion)){
			diffusion.forEach(element => addDiffusion(title, element, 100));
		}

	});
	//console.log("hello");
}

function deleteMovie(title){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo  = db.db("cinema");
		var query = {title : title};
		dbo.collection("films").deleteOne(query, function(err, res){
			if(err) throw err;
			//console.log("1 document deleted");
			db.close();
		});
	});
}

function getActors(title){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("cinema");
		dbo.collection("films").find({title : title}, { projection: { _id: 0, actors: 1 } }).toArray(function(err, result) {
			if (err) throw err;
			//console.log(result);
			db.close();
		});
	});
}

function getMoviesFromProducer(producer){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("cinema");
		dbo.collection("films").find({producer : producer}, { projection: { _id: 0, title : 1 } }).toArray(function(err, result) {
			if (err) throw err;
			//console.log(result);
			db.close();
		});
	});
}

function addActorToList(title, actor){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo  = db.db("cinema");
		dbo.collection("actors").findOne({name : actors}, function(err, result) {
			if (err) throw err;
			if(result != null){
				//console.log("acteur ici = "+result.name);
				addActorToMovie(title, result._id);
			}
		});
	});
}

function getMoviesFromActor(actor){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("cinema");
		dbo.collection("actors").findOne({name : actors}, function(err, result) {
			if (err) throw err;
			if(result != null){
				dbo.collection("films").find({actors : result_id}, { projection: { _id: 0, title : 1 } }).toArray(function(err, result) {
					if (err) throw err;
					//console.log(result);
					db.close();
				});
			}
		});

	});
}

function getDiffusions(title){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("cinema");
		dbo.collection("films").find({title : title}, { projection: { _id: 0, diffusion : 1 } }).toArray(function(err, result) {
			if (err) throw err;
			//console.log(result);
			db.close();
		});
	});
}

function getMoviesWithDate(date){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("cinema");
		dbo.collection("films").find({diffusion : date}, { projection: { _id: 0, title : 1 } }).toArray(function(err, result) {
			if (err) throw err;
			//console.log(result);
			db.close();
		});
	});
}

function setPoster(title, poster){
	mongo.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("cinema");
	  var query = { title : title };
	  var newValues = { $set: { poster : poster } };
	  dbo.collection("films").updateMany(query, newValues, function(err, res) {
			if (err) throw err;
			//console.log("1 document updated");
			db.close();
	  });
	});
}

function addDiffusion(title, diffusion, nb_places){
	mongo.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("cinema");
	  var query = { title : title };
	  var newValues = { $push: { diffusion: {date : diffusion, reservation : 0, max_places : nb_places} } };
	  dbo.collection("films").updateMany(query, newValues, function(err, res) {
			if (err) throw err;
			//console.log("1 document updated");
			db.close();
	  });
	});
}

function addActorToMovie(title, actorID){
	mongo.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("cinema");
	  var query = { title : title };
	  var newValues = { $push: { actors : actorID } };
	  dbo.collection("films").updateMany(query, newValues, function(err, res) {
			if (err) throw err;
			//console.log("1 document updated");
			db.close();
	  });
	});
}


function deleteDiffusion(title, diffusion){
	mongo.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("cinema");
	  var query = { title : title };
	  var newValues = { $pull: { diffusion : {date : diffusion} } };
	  dbo.collection("films").updateMany(query, newValues, function(err, res) {
			if (err) throw err;
			//console.log("1 document updated");
			db.close();
	  });
	});
}

function addReservation(title, date){
	mongo.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("cinema");
	  var query = { title : title, "diffusion.date" : date };
	  var newValues = {$inc: { "diffusion.reservation" : 1}};

	  dbo.collection("films").updateOne(query, newValues, function(err, res) {
			if (err) throw err;
			//console.log("1 document updated");
			db.close();
	  });
	});
}


function remainingTicket(title){
	mongo.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("cinema");
	  dbo.collection("films").findOne({title: title}, { projection: { _id : 0, diffusion : 1 } },function(err, result) {
	  	if (err) throw err;
	  	let cpt = 0;
	  	while(result.diffusion[cpt]!=undefined){
	  		//console.log(result.diffusion[cpt].date+" : "+(result.diffusion[cpt].max_places-result.diffusion[cpt].reservation)+" places restantes");
	  		cpt++;
	  	}

	    db.close();
	   });
	});

}

function limite_age(age){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("cinema");
		dbo.collection("films").find({limite_age : {$gt : age}}, { projection: { _id: 0, title : 1 } }).toArray(function(err, result) {
			if (err) throw err;
			//console.log(result);
			db.close();
		});
	});
}

function loadup(n, action){
	console.log("*******************************************");
	console.log("***** Test de performance : "+action+"*****");
	console.log("*******************************************");

	debut = new Date();

	if(action=="insert"){
		for (var i = 0; i<n; i++){
			let random_title = Math.random().toString(36).substring(7);
	    addMovie(random_title, "Quentin Tarantino", "1994", "L'odyssée sanglante et burlesque de petits malfrats dans la jungle de Hollywood à travers trois histoires qui s'entremêlent. Dans un restaurant, un couple de jeunes braqueurs, Pumpkin et Yolanda, discutent des risques que comporte leur activité. Deux truands, Jules Winnfield et son ami Vincent Vega, qui revient d'Amsterdam, ont pour mission de récupérer une mallette au contenu mystérieux et de la rapporter à Marsellus Wallace.", "https://i.pinimg.com/originals/bd/57/14/bd5714012d49ebf498fc58f9213961ef.jpg", "https://fr.web.img4.acsta.net/pictures/15/08/25/09/24/460224.jpg",["John Travolta", "Samuel L. Jackson", "Bruce Willis"], [],18 );
	  }
	}
	else if (action=="update"){
		for (var i = 0; i<n; i++){
			addActorToList("Pulp Fiction", "Brad Pitt");
		}
	}
	else if(action=="query"){
		for (var i = 0; i<n; i++){
			getMoviesFromActor("Leonardo DiCaprio");
		}
	}


	fin = new Date();

	console.log("temps d'exécution pour n = "+n+"= "+(fin-debut)+" ms");
}


function addActor(name, image){
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		var dbo  = db.db("cinema");
		var obj = {name : name, image : image};
		dbo.collection("actors").insertOne(obj, function(err, res){
			if(err) //console.log("erreur "+err);
			//console.log("1 document inserted");
			db.close();
		});

	});
}

var nb = [1,10,100,1000,10000,50000];
for( var i = 0; i<nb.length;i++){
	loadup(nb[i], "query");
}

/*

createDatabase();
createCollection();
createActorCollection();

addActor("Lenoardo Dicaprio","https://upload.wikimedia.org/wikipedia/commons/4/46/Leonardo_Dicaprio_Cannes_2019.jpg");
addActor("Kate Winslet","https://fr.web.img5.acsta.net/pictures/15/09/15/10/01/065591.jpg");
addActor("Billy Zane","https://upload.wikimedia.org/wikipedia/commons/d/da/Billy_Zane_Photo_Op_GalaxyCon_Raleigh_2019.jpg");
addActor("Kathy Bates","https://fr.web.img4.acsta.net/pictures/20/02/10/16/56/5952598.jpg");
addActor("Sam Worthington","https://upload.wikimedia.org/wikipedia/commons/d/de/Sam_Worthington_4%2C_2013.jpg");
addActor("Zoe Saldana","https://fr.web.img4.acsta.net/pictures/18/05/04/11/38/3895826.jpg");
addActor("Sigourney Weaver","https://fr.web.img5.acsta.net/c_215_290/pictures/15/07/27/13/14/152942.jpg");
addActor("Stephen Lang","https://fr.web.img4.acsta.net/pictures/18/12/17/12/00/0475555.jpg");
addActor("Brad Pitt","https://cdn-elle.ladmedia.fr/var/plain_site/storage/images/people/la-vie-des-people/news/brad-pitt-le-cadeau-surrealiste-qu-il-a-fait-a-sa-maquilleuse-3863330/93143294-1-fre-FR/Brad-Pitt-le-cadeau-surrealiste-qu-il-a-fait-a-sa-maquilleuse.jpg");
addActor("Alicia Von Rittberg","https://upload.wikimedia.org/wikipedia/commons/1/13/2018-01-26-DFP_2018-7082.jpg");
addActor("Logan Lerman","https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Logan_Lerman_at_the_Apple_Store_Soho_in_New_York_City%2C_July_29%2C_2013.jpg/1200px-Logan_Lerman_at_the_Apple_Store_Soho_in_New_York_City%2C_July_29%2C_2013.jpg");
addActor("Matthew McConaughey","https://upload.wikimedia.org/wikipedia/commons/8/8e/Matthew_McConaughey_-_Goldene_Kamera_2014_-_Berlin.jpg");
addActor("Timothée Chalamet","https://www.glamourparis.com/uploads/images/thumbs/201924/a1/une_poup__e____l_effigie_de_timoth__e_chalamet_effraye_le_web_8449.jpeg_north_414x736_transparent.jpg");
addActor("Anne Hatahaway","https://upload.wikimedia.org/wikipedia/commons/b/bd/Anne_Hathaway_in_2017.png");
addActor("Ella Rumpf","https://upload.wikimedia.org/wikipedia/commons/9/95/MJK31207_Ella_Rumpf_%28Tiger_Girl%2C_Berlinale_2017%29.jpg");
addActor("Niels Schneider","https://upload.wikimedia.org/wikipedia/commons/2/2e/Niels_Schneider_2017.jpg");
addActor("Vincent Rottiers","https://upload.wikimedia.org/wikipedia/commons/6/6d/Vincent_Rottiers_Cannes_2015_2.jpg")

addActor("John Travolta", "travolta.png");
addActor("Samuel L. Jackson", "jackson.png");
addActor("Bruce Willis", "willis.png");
*/
addMovie("Pulp Fiction", "Quentin Tarantino", "1994", "L'odyssée sanglante et burlesque de petits malfrats dans la jungle de Hollywood à travers trois histoires qui s'entremêlent. Dans un restaurant, un couple de jeunes braqueurs, Pumpkin et Yolanda, discutent des risques que comporte leur activité. Deux truands, Jules Winnfield et son ami Vincent Vega, qui revient d'Amsterdam, ont pour mission de récupérer une mallette au contenu mystérieux et de la rapporter à Marsellus Wallace.", "https://i.pinimg.com/originals/bd/57/14/bd5714012d49ebf498fc58f9213961ef.jpg", "https://fr.web.img4.acsta.net/pictures/15/08/25/09/24/460224.jpg",["John Travolta", "Samuel L. Jackson", "Bruce Willis"], [],18 );
/*

addMovie("Titanic", "James Cameron","1998","Southampton, 10 avril 1912. Le paquebot le plus grand et le plus moderne du monde, réputé pour son insubmersibilité, le \"Titanic\", appareille pour son premier voyage. Quatre jours plus tard, il heurte un iceberg. A son bord, un artiste pauvre et une grande bourgeoise tombent amoureux.", "http://fr.web.img3.acsta.net/r_1280_720/medias/nmedia/18/36/27/14/20051394.jpg","https://cache.cosmopolitan.fr/data/photo/w1000_ci/5m/titanic-escape-game.jpg", ["Leonardo Dicaprio", "Kate Winslet", "Billy Zane", "Kathy Bates"], ["09/08/2020", "10/08/2022"],12);

addMovie("Avatar", "James Cameron","2009","Malgré sa paralysie, Jake Sully, un ancien marine immobilisé dans un fauteuil roulant, est resté un combattant au plus profond de son être. Il est recruté pour se rendre à des années-lumière de la Terre, sur Pandora, où de puissants groupes industriels exploitent un minerai rarissime destiné à résoudre la crise énergétique sur Terre. Parce que l'atmosphère de Pandora est toxique pour les humains, ceux-ci ont créé le Programme Avatar, qui permet à des \" pilotes \" humains de lier leur esprit à un avatar, un corps biologique commandé à distance, capable de survivre dans cette atmosphère létale. Ces avatars sont des hybrides créés génétiquement en croisant l'ADN humain avec celui des Na'vi, les autochtones de Pandora. Sous sa forme d'avatar, Jake peut de nouveau marcher. On lui confie une mission d'infiltration auprès des Na'vi, devenus un obstacle trop conséquent à l'exploitation du précieux minerai. Mais tout va changer lorsque Neytiri, une très belle Na'vi, sauve la vie de Jake... ", "https://images-na.ssl-images-amazon.com/images/I/615Yl386WYL._AC_SY679_.jpg","https://fr.web.img5.acsta.net/newsv7/18/11/03/12/43/5957563.jpg", ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang"], "12/08/2020",13);

addMovie("Fury","David Ayer", "2014", "En avril 1945, les Alliés mènent leur ultime offensive en Europe. À bord d'un tank Sherman, le sergent Wardaddy et ses quatre hommes s'engagent dans une mission à très haut risque bien au-delà des lignes ennemies. Face à un adversaire dont le nombre et la puissance de feu les dépassent, Wardaddy et son équipage vont devoir tout tenter pour frapper l'Allemagne nazie en plein coeur.", "https://fr.web.img5.acsta.net/pictures/14/09/22/16/44/411457.jpg", "https://www.breizh-info.com/wp-content/uploads/2014/10/Fury.jpg",["Brad Pitt", "Alicia Von Rittberg", "Logan Lerman"], ["09/08/2020", "10/08/2022"],12);

addMovie("Interstellar", "Christopher Nolan", "2014","Dans un futur proche, la Terre est de moins en moins accueillante pour l'humanité qui connaît une grave crise alimentaire. Le film raconte les aventures d'un groupe d'explorateurs qui utilise une faille récemment découverte dans l'espace-temps afin de repousser les limites humaines et partir à la conquête des distances astronomiques dans un voyage interstellaire.","https://fr.web.img6.acsta.net/pictures/14/09/24/12/08/158828.jpg",  "https://lumiere.net.nz/wp-content/uploads/2016/02/feat_interstellar.jpg", ["Matthew McConaughey", "Timothée Chalamet", "Anne Hatahaway"],["09/08/2020", "10/08/2022"],12 );


addMovie("Sympathie pour le diable", "Guillaume de Fontenay", "2018", "Sarajevo, novembre 92. Sept mois après le début du siège, Paul Marchand, correspondant de guerre, risque sa vie et tente de témoigner d'une guerre insensée et du quotidien des 400 000 âmes prises en otages par les troupes serbes sous le regard impassible de la communauté internationale.", "https://fr.web.img6.acsta.net/pictures/19/10/25/16/05/1555722.jpg", "https://www.ecranlarge.com/uploads/image/001/111/sympathie-pour-le-diable-photo-sympathie-pour-le-diable-1111052.jpg", ["Ella Rumpf", "Niels Schneider", "Vincent Rottiers"],["09/08/2020", "10/08/2022"],12 );
*/
//loadup();

//deleteMovie("Titanic");
//getActors("Titanic");
//getMoviesFromProducer("Test");
//getMoviesFromActor("Dicaprio");
//getDiffusions("Titanic");
//getMoviesWithDate("09/08/2020");
//setPoster("Titanic", "http://newlink.html/poster.png");
//addDiffusion("Titanic", "10/10/2021", 120);
//deleteDiffusion("Titanic", "09/08/2020");
//addReservation("Titanic", "09/08/2020");
//remainingTicket("Titanic");
//limite_age(12);
