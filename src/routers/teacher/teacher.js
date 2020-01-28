const teacherController = require ('../../controllers/api/teacher/index');
const middleware = require ('../../middlewares/index');

module.exports = app => {
    app.get ('/teacher', middleware.checkToken, teacherController.readAllTeacher);
    app.get ('/teacher/:id', middleware.checkToken, teacherController.readTeacher);
    app.post ('/teacher', middleware.checkToken, middleware.checkAccess, teacherController.createTeacher);
    app.put ('/teacher', middleware.checkToken, middleware.checkAccess, teacherController.updateTeacher);
    app.delete ('/teacher', middleware.checkToken, middleware.checkAccess, teacherController.deleteTeacher);
};