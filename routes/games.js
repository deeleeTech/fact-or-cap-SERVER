var express = require('express');
var MongoClient = require('mongodb').MongoClient
var router = express.Router();
var NBAteams = require('./teamData/NBAteams');
var NFLteams = require('./teamData/NFLteams');


const connectionString = `mongodb+srv://deelee12:fuckXbox225@cluster0.kowrt.mongodb.net/FactOrCap?retryWrites=true&w=majority`;


/* GET NBA TEAMS  */
router.get('/allTeams', function(req, res, next) {
  res.send({ 
      "NBA" : NBAteams,
      "NFL" : NFLteams
   })
});

/* GET NBA GAMES  */
router.get('/allNBA', async function(req, res, next) {
   MongoClient.connect(connectionString, (err, client) => {
     if (err) return console.error(err)
     const db = client.db('FactOrCap');
     db.collection('NBAgames').find().toArray() //MONGO QUERY!!!
     .then(results => {
       //console.log(results) // MONGO RESULTS
       if(results.length > 0){ // USER FOUND
         //console.log(results[0])
         res.send({ message: 'success', resData: results })
       }
       else{ //USERNAME NOT FOUND
         res.send({ message: 'no_games_found', resData: {} })
       }
     })
     .catch(error => {
       console.error(error)
     })
   })
 });

 /* GET NFL GAMES  */
router.get('/allNFL', async function(req, res, next) {
   MongoClient.connect(connectionString, (err, client) => {
     if (err) return console.error(err)
     const db = client.db('FactOrCap');
     db.collection('NFLgames').find().toArray() //MONGO QUERY!!!
     .then(results => {
       //console.log(results) // MONGO RESULTS
       if(results.length > 0){ // USER FOUND
         //console.log(results[0])
         res.send({ message: 'success', resData: results })
       }
       else{ //USERNAME NOT FOUND
         res.send({ message: 'no_games_found', resData: {} })
       }
     })
     .catch(error => {
       console.error(error)
     })
   })
 });



module.exports = router;