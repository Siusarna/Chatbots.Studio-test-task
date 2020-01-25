const mongoose = require ('mongoose');
require ('../models/index');
const jwt = require ('jsonwebtoken');
const config = require ('../config/default');
const {readOneDocFromDb} = require ('../db/index');

const User = mongoose.model ('User');

module.exports = async (req, res, next) => {
    const {accessToken} = req.cookies;
    const payload = jwt.verify (accessToken, config.jwt.secret);
    const user = await readOneDocFromDb (User, {_id: payload.userId});
    console.log (payload);
    if (user.role !== 'teacher') {
        res.status (403).json ({message: 'Access is permanently forbidden for this user'});
    }
    next ();
};