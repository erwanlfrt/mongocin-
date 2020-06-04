function addActor(){
  var actorsDiv = document.getElementById("actorsList");
  if(document.getElementById("actorMovie")!=null){
    var listValeur = document.getElementsByClassName("actorMovie");
    var tab_of_values = []
    for(let i = 0; i<listValeur.length; i++){
      tab_of_values.push(listValeur[i].value);
    }
  }
  actorsDiv.innerHTML += "<input type='text' name='actorMovie' id='actorMovie' class='form-control actorMovie'>";
  if(listValeur!=null){
    var newListValeur = document.getElementsByClassName("actorMovie");
    for(let j = 0; j<newListValeur.length-1; j++){
      newListValeur[j].value = tab_of_values[j];
    }
  }

}

function addDiffusion(){
  var diffusionDiv = document.getElementById("diffusionList");
  if(document.getElementById("diffusionMovieDate")!=null){
    var listValeurDate = document.getElementsByClassName("diffusionMovieDate");
    var dateValues = [];

    var listValeurReservation = document.getElementsByClassName("diffusionMovieReservation");
    var reservationValues = [];

    var listValeurMaxPlaces = document.getElementsByClassName("diffusionMovieMaxPlaces");
    var maxPlacesValues = [];

    for(let k = 0; k<listValeurReservation.length; k++){
      dateValues.push(listValeurDate[k].value);
      reservationValues.push(listValeurReservation[k].value);
      maxPlacesValues.push(listValeurMaxPlaces[k].value);
    }
  }

  diffusionDiv.innerHTML += "<input type='text' id='diffusionMovieDate' name='diffusionMovieDate' class='form-control diffusionMovieDate' value=''>";
  diffusionDiv.innerHTML += "<input type='text' id='diffusionMovieReservation' name='diffusionMovieReservation' class='form-control diffusionMovieReservation' value=''>"
  diffusionDiv.innerHTML += "<input type='text' id='diffusionMovieMaxPlaces' name='diffusionMovieMaxPlaces' class='form-control diffusionMovieMaxPlaces' value=''>"

  if(listValeurDate!=null){

    var newListValeurDate = document.getElementsByClassName("diffusionMovieDate");
    var newListValeurReservation = document.getElementsByClassName("diffusionMovieReservation");
    var newListValeurMaxPlaces = document.getElementsByClassName("diffusionMovieMaxPlaces");

    for(let m = 0; m<listValeurDate.length-1; m++){
      newListValeurDate[m].value = dateValues[m];
      newListValeurMaxPlaces[m].value = maxPlacesValues[m];
      newListValeurReservation[m].value = reservationValues[m];
    }
  }
}
