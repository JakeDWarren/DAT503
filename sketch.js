//Import MongoDB
var MongoClient = require('mongodb').MongoClient;

//Import XMLHttpRequest
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//URL of the Mongo database
var url = 'mongodb://DAT503:reflexive503@ds331735.mlab.com:31735/dat503';

//Variables for api key and place id
var placeID = "ChIJYQmSI0yTbEgRSxmPatvssbM";
var apiKey = "AIzaSyAwlLOJUIbDliHiPBmUnIl6J4iu-4z0YjY"

//Variable to store parsed result data of json file from api
var resultsJS;

// Variables for extracted results of resultsJS to go to db
var dbName;
var dbIcon;
var dbRating;
var dbPrice_level;

//Combine key and placeid to create url
var apiURL = "https://maps.googleapis.com/maps/api/place/details/json?"+"placeid="+placeID+"&key="+apiKey;

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.open('GET',apiURL, true);

request.onload = function () {
  // Begin accessing JSON data here

  results = request.responseText;

  resultsJS = JSON.parse(results);

  dbName = resultsJS.result.name;
  dbIcon = resultsJS.result.icon;
  dbRating = resultsJS.result.rating;
  dbPrice_level = resultsJS.result.price_level;

}

// Send request
request.send();

setTimeout(function(){
  //Layout data ready for database
  var mongoLog = [{
    place_id: placeID,
    name: dbName,
    icon: dbIcon,
    rating: dbRating,
    price_level: dbPrice_level,
  }];

  //Connect to the client
  MongoClient.connect(url, function (err, db) {
    //Collection1 is the name of the db's collection
    var col = db.collection('Stores');
    //Insert the results, and close the connection
    col.insert(mongoLog, function(err, result){
      db.close();
    });
    console.log("Data added");
  });
},1000);
