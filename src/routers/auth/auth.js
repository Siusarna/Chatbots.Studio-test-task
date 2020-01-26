const auth = require ('../../controllers/api/auth/index');
const middleware = require ('../../middlewares/index');

module.exports = app => {
    app.post ('/register/teacher', auth.register.registerTeacher);
    app.post ('/register/student', auth.register.registerStudent);
    app.post ('/login', auth.login);
    app.get ('/test', middleware.checkToken, middleware.checkAccess, (req, res) => {
        res.send ('ok');
    });
};