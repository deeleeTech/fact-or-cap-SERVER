var mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {type: String},
  password: {type: String},
  email: {type: String},
  favoriteSport: {type: String},
  favoriteTeam: {type: String},
  capCoins: {type: Number}
});

const User = mongoose.model("User", UserSchema);

module.exports = User;