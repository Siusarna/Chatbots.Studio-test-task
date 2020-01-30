const auth = require('../../controllers/api/auth/index');

module.exports = (app) => {
  app.post('/login', auth.login);
};
