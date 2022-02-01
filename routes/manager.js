var express = require('express');
var MongoClient = require('mongodb').MongoClient
var router = express.Router();
var NBAteams = require('./teamData/NBAteams');
var NFLteams = require('./teamData/NFLteams');
require('dotenv').config();

const connectionString = process.env.MONGO_STRING;


 /* GET NFL GAMES  */
router.post('/newGame', async function(req, res, next) {
   MongoClient.connect(connectionString, (err, client) => {
     if (err) return console.error(err)
     const db = client.db('FactOrCap');
     const gameFile = req.body;
     const gameSport = (gameFile.gameID).slice(0,3); //GETS ID PREFIX NBA, NFL, ect
     if(gameSport == 'NBA'){
        db.collection('NBAgames').insertOne(gameFile).then(()=>{
          res.send({ message: 'created_new_game' })
        })
     }
     else if(gameSport == 'NFL'){
        db.collection('NFLgames').insertOne(gameFile).then(()=>{
          res.send({ message: 'created_new_game' })
        })
    }
   })
 });



module.exports = router;