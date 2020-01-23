const auth = require ('./auth/auth');

module.exports = app => {
    auth (app);
};