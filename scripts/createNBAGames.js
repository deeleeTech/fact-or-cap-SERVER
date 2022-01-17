var MongoClient = require('mongodb').MongoClient;
var allNBAteams = require('../routes/teamData/NBAteams')

const connectionString = `mongodb+srv://deelee12:fuckXbox225@cluster0.kowrt.mongodb.net/FactOrCap?retryWrites=true&w=majority`;
// ++++++++++++++++++++++++++++++++++
const gmID = 'NBA014';
const awayID = 9;
const homeID = 10;
const gameDate = "01-18-22";
const gameTime = "21:00";
// ++++++++++++++++++++++++++++++++++
//!! MONGO OBJECT HERE !!!!!!!!!!!!!!
const newGameEntry = {
  gameID : gmID,
  homeTeamID: homeID,
  homeTeamName: allNBAteams[homeID-1].teamName,
  homeTeamScore: 0,
  awayTeamID: awayID,
  awayTeamName: allNBAteams[awayID-1].teamName,
  awayTeamScore: 0,
  gameStatus: "upcoming",
  gameStartDate: new Date(gameDate),
  gameStartTime: gameTime
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

MongoClient.connect(connectionString, (err, client) => {
    if (err) return console.error(err)
    const db = client.db('FactOrCap');
    db.collection('NBAgames').insertOne(newGameEntry)  //MONGO ENTRY!!!
    .then(results => {
      console.log('Successful Entry: ')
      console.log(newGameEntry)
    })
    .catch(error => {
      console.error(error)
    })
    return
  })