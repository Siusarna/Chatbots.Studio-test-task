const uuid = require ('uuid/v4');
const jwt = require ('jsonwebtoken');
const config = require ('../../config/default');
const {updateOneDocInDb} = require ('../../db/index');
const mongoose = require ('mongoose');
require ('../../models/index');

const Token = mongoose.model ('Token');

const generateAccessToken = (userId) => {
    const payload = {
        userId,
        type: config.jwt.tokens.access.type
    };
    const options = {expiresIn: config.jwt.tokens.access.expiresIn};
    return jwt.sign (payload, config.jwt.secret, options);
};

const generateRefreshToken = () => {
    const payload = {
        id: uuid (),
        type: config.jwt.tokens.refresh.type
    };
    const options = {expiresIn: config.jwt.tokens.refresh.expiresIn};
    return {
        refreshToken: jwt.sign (payload, config.jwt.secret, options),
        id: payload.id
    };
};

const getAndUpdateToken = async (userId) => {
    const accessToken = generateAccessToken (userId);
    const {refreshToken, tokenId} = generateRefreshToken ();
    return updateOneDocInDb (Token, {userId}, {tokenId})
        .then (() => {
            return {
                accessToken,
                refreshToken
            };
        });
};

module.exports = {
    getAndUpdateToken
};