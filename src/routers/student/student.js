const studentController = require ('../../controllers/api/student/index');
const middleware = require ('../../middlewares/index');

module.exports = app => {
    app.get ('/student', middleware.checkToken, studentController.readAllStudent);
    app.get ('/student/:id', middleware.checkToken, studentController.readStudent);
    app.post ('/student', middleware.checkToken, middleware.checkAccess, studentController.createStudent);
    app.put ('/student', middleware.checkToken, middleware.checkAccess, studentController.updateStudent);
    app.delete ('/student', middleware.checkToken, middleware.checkAccess, studentController.deleteStudent);
};