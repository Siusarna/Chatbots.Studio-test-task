const index = require ('../../controllers/api/auth/index');

module.exports = app => {
    app.post ('/register', index.register);
    app.post ('/login', index.login);
};