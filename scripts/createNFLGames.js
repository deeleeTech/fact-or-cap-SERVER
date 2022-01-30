var MongoClient = require('mongodb').MongoClient;
var allNFLteams = require('../routes/teamData/NFLteams')

const connectionString = `mongodb+srv://deelee12:fuckXbox225@cluster0.kowrt.mongodb.net/FactOrCap?retryWrites=true&w=majority`;
// ++++++++++++++++++++++++++++++++++
const gmID = 'NFL005';
const awayID = 28;
const homeID = 17;
const gameDate = "01-30-22";
const gameTime = "17:30";
// ++++++++++++++++++++++++++++++++++
//!! MONGO OBJECT !!!!!!!!!!!!!!!!!!!!
const newGameEntry = {
  gameID : gmID,
  homeTeamID: homeID,
  homeTeamName: allNFLteams[homeID-1].teamName,
  homeTeamScore: 0,
  awayTeamID: awayID,
  awayTeamName: allNFLteams[awayID-1].teamName,
  awayTeamScore: 0,
  gameStatus: "upcoming",
  gameStartDate: new Date(gameDate),
  gameStartTime: gameTime
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

MongoClient.connect(connectionString, (err, client) => {
    if (err) return console.error(err)
    const db = client.db('FactOrCap');
    db.collection('NFLgames').insertOne(newGameEntry)  //MONGO ENTRY!!!
    .then(results => {
      console.log('Successful Entry: ')
      console.log(newGameEntry)
    })
    .catch(error => {
      console.error(error)
    })
    return
  })