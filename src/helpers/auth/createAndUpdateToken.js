const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../../config/default');
const { updateOneDocInDb } = require('../../db/index');
require('../../models/index');

const Token = mongoose.model('Token');

const generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: config.jwt.tokens.access.type,
  };
  const options = { expiresIn: config.jwt.tokens.access.expiresIn };
  return jwt.sign(payload, config.jwt.secret, options);
};

const generateRefreshToken = (userId) => {
  const payload = {
    tokenId: uuid(),
    userId,
    type: config.jwt.tokens.refresh.type,
  };
  const options = { expiresIn: config.jwt.tokens.refresh.expiresIn };
  return {
    refreshToken: jwt.sign(payload, config.jwt.secret, options),
    tokenId: payload.tokenId,
  };
};

const getAndUpdateTokens = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const { refreshToken, tokenId } = generateRefreshToken(userId);
  return updateOneDocInDb(Token, { userId }, { tokenId })
    .then(() => ({
      accessToken,
      refreshToken,
    }));
};

module.exports = {
  getAndUpdateTokens,
};
