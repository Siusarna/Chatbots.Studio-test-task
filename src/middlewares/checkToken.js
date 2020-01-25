const config = require ('../config/default');
const jwt = require ('jsonwebtoken');
const {getAndUpdateTokens} = require ('../helpers/auth/index');
const setDataInCookie = require ('../controllers/api/auth/setDataInCookie');

const setTokens = (tokens, res) => {
    const {accessToken, refreshToken} = tokens;
    setDataInCookie (res, 'accessToken', accessToken, config.jwt.tokens.access.expiresIn);
    setDataInCookie (res, 'refreshToken', refreshToken, config.jwt.tokens.refresh.expiresIn);
};

const processingRefreshToken = async (refreshToken, res, next) => {
    if (!refreshToken) {
        return res.status (401).json ({message: 'Tokens expired, please log in again'});
    }
    let payload;
    try {
        payload = jwt.verify (refreshToken, config.jwt.secret);
        if (payload.type !== 'refresh') {
            return res.status (400).json ({message: 'Invalid token, please log in again'});
        }
    } catch (e) {
        return res.status (400).json ({message: 'Invalid token, please log in again'});
    }
    const tokens = await getAndUpdateTokens (payload.userId);
    setTokens (tokens, res);
    next ();
};

module.exports = async (req, res, next) => {
    if (!req.cookies) {
        return res.status (401).json ({message: 'Unauthorized'});
    }
    const {accessToken, refreshToken} = req.cookies;
    if (!accessToken) {
        return processingRefreshToken (refreshToken, res, next);
    }
    let payload;
    try {
        payload = jwt.verify (accessToken, config.jwt.secret);
    } catch (e) {
        return processingRefreshToken (refreshToken, res, next);
    }
    if (payload.type !== 'access') {
        return res.status (400).json ({message: 'Invalid token, please log in again'});
    }
    next ();
};