//dotenv npm config
require('dotenv').config();

//load spotify, OMDB, and bands in town npm packages
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');

//user variables
var command = process.argv[2];
var query = process.argv[3];

//add a variable to store our keys 
var keys = require('./keys.js');
//console.log(keys);
var Spotify = require('node-spotify-api')
var Spotify = new Spotify({
   id: keys.spotify.id,
   secret: keys.spotify.secret
});
// bands in town 
var concertQueryUrl = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";
var movieQueryUrl = 'http://www.omdbapi.com/?t=' + query + '&y=&plot=short&apikey=trilogy';
var fs = require('fs');
// make a default movie and song 
var defaultMovie = 'Mr.Nobody';
var defaultSong = 'Enter Sandman';


//functions for our bot 
function processCommands(switchCommand, query) {
    switch(switchCommand){
        case 'concert-this':
        concertThis(query); break;
        case 'spotify-this-song':
		//If user has not specified a song , use default
		if(query === undefined){
			query = defaultSong;
		}     
        spotifyThis(query); break;
        case 'movie-this':
		//If user has not specified a movie Name , use default
		if(query === undefined){
			query = defaultMovie;
		}    
		movieThis(query); break;
        case 'do-what-it-says':
		doWhatItSays(); break;
	    default: 
		console.log("Invalid command. Please type any of the following commnds: concert-this spotify-this-song movie-this or do-what-it-says");
}


}
// spotify logic
function spotifyThis(song){
    //if user has not specified a song , default to 'Enter Sandman' 
    if(song === ''){
        song = 'Enter Sandman';
    }

    Spotify.search({ type: 'track', query: song}, function(err, data) {
        if (err) {
            console.log('Error noticed' + err);
            return;
        }

        var song = data.tracks.items[0]
        console.log('Artists');
        for (i=0; i<song.artists.length; i++){
            console.log(song.artists[i].name);
        }

        console.log('Song Name');
        console.log(song.name);

        console.log('Preview Link');
        console.log(song.preview_url);

        console.log('Album');
        console.log(song.album.name);

    });
};

//http request
//cocnert-this function is not operational getting errors 'canot read property 'venue' of undefined 
function concertThis() {
    request(concertQueryUrl, function (err, res, body) {
        if (err) {
            return console.log(err);
        }
        if (res.statusCode === 200) {
            var venue = JSON.parse(body)[0].venue;
            var dateTime = JSON.parse(body)[0].datetime;
            var formattedDateTime = moment(dateTime).format('MM DD YYYY');
            var location = venue.city + ', ' + venue.region;
            console.log('This artist is playing at: ' + venue.name);
            console.log('This concert will take place in: ' + location);
            console.log('They will playing on: ' + formattedDateTime);
        }
    });
};
     

// Functions for OMDB
var movieThis = function() {
    
    var movieQuery;
    if (movieQuery === undefined) {
        movieQuery = 'mr nobody';
    }
    
    // HTTP request
    request(movieQueryUrl, function (error, response, body) {
        if(movieQuery) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).rottenTomatoesRating);
        console.log("Production Country: " + JSON.parse(body).Country);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
    
      } else { 
        console.log("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netflix!");
      }
    
    });
    }

    function doWhatItSays(){
        fs.readFile('random.txt', 'utf8', function(err, data){
    
            if (err){ 
                return console.log(err);
            }
    
            var dataArr = data.split(',');
    
            processCommands(dataArr[0], dataArr[1]);
        });
    }
    


processCommands(command, query);
