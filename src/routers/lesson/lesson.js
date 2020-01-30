const lessonControllers = require('../../controllers/api/lesson/index');
const middleware = require('../../middlewares/index');

module.exports = (app) => {
  app.get('/lesson', middleware.checkToken, lessonControllers.readAllLessons);
  app.get('/lesson/:id', middleware.checkToken, lessonControllers.readLesson);
  app.post('/lesson', middleware.checkToken, middleware.checkAccess, lessonControllers.createLesson);
  app.put('/lesson', middleware.checkToken, middleware.checkAccess, lessonControllers.updateLesson);
  app.delete('/lesson', middleware.checkToken, middleware.checkAccess, lessonControllers.deleteLesson);
};
