const auth = require ('./auth/auth');
const group = require ('./group/group');

module.exports = app => {
    auth (app);
    group (app);
};