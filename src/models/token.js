const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  tokenId: String,
  userId: String,
});

const tokenModel = mongoose.model('Token', TokenSchema);

module.exports = tokenModel;
