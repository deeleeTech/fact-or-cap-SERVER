var express = require('express');
var MongoClient = require('mongodb').MongoClient
var router = express.Router();

const username = '';
const mongoPass = ''

const connectionString = `mongodb+srv://${username}:${mongoPass}@cluster0.kowrt.mongodb.net/FactOrCap?retryWrites=true&w=majority`;


/* GET users listing. */
router.get('/login', async function(req, res, next) {
  MongoClient.connect(connectionString, (err, client) => {
    if (err) return console.error(err)
    //      console.log('Connected to Database');
    //      console.log('Displaying Request Info:');
    //      console.log(req.query); //QUERY FROM FRONT END
    //      console.log('Now Searching for Users');
    let clientUsername = req.query.usernameAttempt;
    let clientPassword = req.query.passwordAttempt;
    const db = client.db('FactOrCap');
    db.collection('Users').find({ username: clientUsername }).toArray() //MONGO QUERY!!!
    .then(results => {
      //console.log(results) // MONGO RESULTS
      if(results.length > 0){ // USER FOUND
        //console.log(results[0]) 
        let mongoPassword = results[0].password;
        if(mongoPassword == clientPassword){ // SUCCESSFUL CREDS
          let loginInfo = results[0];
          delete loginInfo.password; //REMOVE PASSWORD DATA BEFORE PASSING TO CLIENT
          res.send({ message: 'successful_login', loginData: loginInfo })
        }
        else{ // USER NOT FOUND
          res.send({ message: 'incorrect_password', loginData: {} })
        }
      }
      else{ //USERNAME NOT FOUND
        res.send({ message: 'incorrect_username', loginData: {} })
      }
    })
    .catch(error => {
      console.error(error)
    })
  })
});

/* POST NEW USERS */
router.post('/signup', async function(req, res, next) {
  MongoClient.connect(connectionString, (err, client) => {
    if (err) return console.error(err)
    let clientUsername = req.data.usernameAttempt;
    let clientPassword = req.data.passwordAttempt;
    let clientEmail = req.data.emailAttempt;
    const db = client.db('FactOrCap');
    db.collection('Users').find({ username: clientUsername }).toArray() //MONGO QUERY!!!
    .then(results => {
      //console.log(results) // MONGO RESULTS
      if(results.length > 0){ // USER FOUND
        //console.log(results[0]) 
        res.send({ message: 'user_exists', loginData: {} })
      }
      else{ //CREATE NEW USER
        db.collection('Users').insertOne({
          username: clientUsername,
          password: clientPassword,
          email: clientEmail,
          capCoins: 100
        }).then(()=>{
          res.send({ message: 'created_new_user', loginData: {} })
        }).catch(()=>{
          res.send({ message: 'failed_to_create_user', loginData: {} })
        })
      }
    })
    .catch(error => {
      console.error(error)
    })
  })
});

module.exports = router;
