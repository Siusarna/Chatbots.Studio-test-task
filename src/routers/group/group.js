const groupController = require('../../controllers/api/group/index');
const middleware = require('../../middlewares/index');

module.exports = (app) => {
  app.get('/group', middleware.checkToken, groupController.readAllGroup);
  app.get('/group/:name', middleware.checkToken, groupController.readGroup);
  app.post('/group', middleware.checkToken, middleware.checkAccess, groupController.createGroup);
  app.put('/group', middleware.checkToken, middleware.checkAccess, groupController.updateGroup);
  app.delete('/group', middleware.checkToken, middleware.checkAccess, groupController.deleteGroup);
};
