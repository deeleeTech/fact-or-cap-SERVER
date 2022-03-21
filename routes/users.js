var express = require('express');
var MongoClient = require('mongodb').MongoClient
var router = express.Router();
var bcrypt = require('bcrypt');
require('dotenv').config();

const connectionString = process.env.MONGO_STRING;


/* GET users listing. */
router.get('/login', async function(req, res, next) {
  MongoClient.connect(connectionString, (err, client) => {
    if (err) return console.error(err)
    //      console.log('Connected to Database');
    //      console.log('Displaying Request Info:');
    //      console.log(req.query); //QUERY FROM FRONT END
    //      console.log('Now Searching for Users');
    let clientUsername = req.query.usernameAttempt;
    let clientPassword = req.headers.authorization;
    const db = client.db('FactOrCap');
    db.collection('Users').find({ username: clientUsername }).toArray() //MONGO QUERY !!! ATTEMPTS USER !!!
    .then(results => {
      if(results.length > 0){ //#### USER FOUND ##############
        //console.log(results[0]) 
        const mongoPassword = results[0].password;
        bcrypt.compare(clientPassword, mongoPassword, function(err, hashRes) {
          if (hashRes == false )  res.send({ message: 'incorrect_password', loginData: {} }) // PASS TO CLIENT *******************************>
          else {//oooo SUCCESSFUL PASSWORD ATTEMPT oooooooooo
            let loginInfo = results[0];
            let currentDate = new Date(); 
            loginInfo.lastLogin = currentDate.getTime(); // Adds Milisecond Timestamp for the Client to reference
            delete loginInfo.password; //REMOVE PASSWORD DATA BEFORE PASSING TO CLIENT
            db.collection('SingleGameBets').find({ $or: [{ usernamePosted: clientUsername },{ usernameAccepted: clientUsername }] }).toArray() //MONGO QUERY!!!
            .then(betResults => {
              loginInfo.betsData = betResults;
              res.send({ message: 'successful_login', loginData: loginInfo }) // PASS TO CLIENT **************************>
            })
          }
        });
      }
      else{ //#### USER NOT FOUND ##############
        res.send({ message: 'incorrect_username', loginData: {} }) // PASS TO CLIENT *********************************>
      }
    })
    .catch(error => {
      console.error(error)
    })
  })
});

/* POST NEW USERS */
router.post('/signup', async function(req, res, next) {
  MongoClient.connect(connectionString, async (err, client) => {
    if (err) return console.error(err)
    const clientUsername = req.body.usernameAttempt;
    const clientEmail = req.body.emailAttempt;
    const currentDate = new Date();

    const passwordString = req.body.passwordAttempt;
    const salt = await bcrypt.genSalt(10);
    const clientPassword = await bcrypt.hash(passwordString, salt);

    const loginInfo = {
      username: clientUsername,
      password: clientPassword,
      email: clientEmail,
      capCoins: 100
    };
    const db = client.db('FactOrCap');
    db.collection('Users').find({ username: clientUsername }).toArray() //MONGO QUERY!!!
    .then(results => {
      //console.log(results) // MONGO RESULTS
      if(results.length > 0){ // USER FOUND
        //console.log(results[0]) 
        res.send({ message: 'user_exists', loginData: {} })
      }
      else{ //CREATE NEW USER
        db.collection('Users').insertOne(loginInfo).then(()=>{
          loginInfo.lastLogin = currentDate.getTime() // ADDS LAST LOGIN FOR CLIENT TO REFREENCE
          loginInfo.betsData = [];
          res.send({ message: 'created_new_user', loginData: loginInfo })
        })
      }
    })
    .catch(error => {
      console.error(error)
    })
  })
});

module.exports = router;
