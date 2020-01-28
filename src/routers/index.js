const auth = require ('./auth/auth');
const group = require ('./group/group');
const student = require ('./student/student');
const teacher = require ('./teacher/teacher');

module.exports = app => {
    auth (app);
    group (app);
    student (app);
    teacher (app);
};