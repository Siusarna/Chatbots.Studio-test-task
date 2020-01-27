const auth = require ('./auth/auth');
const group = require ('./group/group');
const student = require ('./student/student');

module.exports = app => {
    auth (app);
    group (app);
    student (app);
};