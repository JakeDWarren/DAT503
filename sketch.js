// Import MongoDB
var MongoClient = require('mongodb').MongoClient;

// Import XMLHttpRequest
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// URL of the Mongo database
var url = 'mongodb://DAT503:reflexive503@ds331735.mlab.com:31735/dat503';

// Variables for api key and place id
var placeID = "ChIJ96IUT0yTbEgRvMvuGyRNpO0";
var apiKey = "AIzaSyAwlLOJUIbDliHiPBmUnIl6J4iu-4z0YjY"

// Variable to store parsed result data of json file from api
var resultsJS;

// Variables for extracted results of resultsJS to go to db
var dbName;
var dbVicinity;
var dbLongLat;
var dbPhone;
var dbIcon;
var dbWebsite;
var dbRating;
var dbPrice_level;
var dbOpening_hours;

// Combine key and placeid to create url
var apiURL = "https://maps.googleapis.com/maps/api/place/details/json?"+"placeid="+placeID+"&key="+apiKey;

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.open('GET',apiURL, true);

// On load perform these action (accessing the data and preparing for db)
request.onload = function () {

  //  Drill down to the wanted information from the API responce
  results = request.responseText;

  // Convert JSON to JavaScript object
  resultsJS = JSON.parse(results);

  // Extract all required info from array and store in global varaiables for db
  dbName = resultsJS.result.name;
  dbVicinity = resultsJS.result.vicinity;
  dbLongLat = resultsJS.result.geometry.location;
  dbPhone = resultsJS.result.international_phone_number;
  dbIcon = resultsJS.result.icon;
  dbWebsite = resultsJS.result.website;
  dbRating = resultsJS.result.rating;
  dbPrice_level = resultsJS.result.price_level;
  dbOpening_hours = resultsJS.result.opening_hours.weekday_text;
  dbReviews = resultsJS.result.reviews;

}

// Send request
request.send();

// Send information to database after a delayed period of 1 second (allows api to run and update variables for sending)
setTimeout(function(){
  // Layout data ready for database
  var mongoLog = [{
    place_id: placeID,
    name: dbName,
    street: dbVicinity,
    longlat: dbLongLat,
    phone: dbPhone,
    icon: dbIcon,
    website: dbWebsite,
    rating: dbRating,
    price_level: dbPrice_level,
    opening_hours: dbOpening_hours,
    reviews: dbReviews
  }];

  // Log data to be oploaded
  console.log(mongoLog);

  // Open connection to database an upload the prepared variables
  MongoClient.connect(url, function (err, db) {

    // Stores is the name of the db's collection
    var col = db.collection('Stores');

    // Insert the results, and close the connection
    col.insert(mongoLog, function(err, result){
      db.close();
    });

    // Log when upload is complete
    console.log("Data added");
  });
},1000);
