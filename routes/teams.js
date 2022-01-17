var express = require('express');
var router = express.Router();
var NBAteams = require('./teamData/NBAteams');
var NFLteams = require('./teamData/NFLteams')

/* GET NBA TEAMS  */
router.get('/allTeams', function(req, res, next) {
  res.send({ 
      "NBA" : NBAteams,
      "NFL" : NFLteams
   })
});



module.exports = router;