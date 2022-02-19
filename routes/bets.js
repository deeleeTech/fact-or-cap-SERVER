var express = require('express');
var MongoClient = require('mongodb').MongoClient
var router = express.Router();
require('dotenv').config();

const connectionString = process.env.MONGO_STRING;

/* GET ALL BETS */
router.get('/allBets', async function(req, res, next) {
    MongoClient.connect(connectionString, (err, client) => {
      if (err) return console.error(err)
      const db = client.db('FactOrCap');
      db.collection('SingleGameBets').find().toArray() //MONGO QUERY!!!
      .then(results => {
        //console.log(results) // MONGO RESULTS
        if(results.length > 0){ // USER FOUND
          //console.log(results[0])
          res.send({ message: 'bets_found', betData: results })
        }
        else{ //USERNAME NOT FOUND
          res.send({ message: 'no_bets_found', betData: {} })
        }
      })
      .catch(error => {
        console.error(error)
      })
    })
  });

  /* CREATE NEW GAME BET */
router.post('/newGameBet', async function(req, res, next) {
  MongoClient.connect(connectionString, (err, client) => {
    if (err) return console.error(err)
    //console.log(req.body);
    const newEntryStager = req.body.betData;
    const userAccount = req.body.userAccount;
    const updatedCoins = req.body.newCapCoins
    const db = client.db('FactOrCap');
    db.collection('SingleGameBets').insertOne(newEntryStager) //MONGO QUERY!!!
    .then(()=>{
      db.collection('Users').updateOne({ username: userAccount },{ $set: { "capCoins" : updatedCoins } }) //FINDS USER TO UPDATE COINS
      .then(()=>{
        res.send({ message: 'created_new_post' })
      })
      
    }).catch(()=>{
      res.send({ message: 'failed_to_create_post' })
    })
  })
});

module.exports = router;