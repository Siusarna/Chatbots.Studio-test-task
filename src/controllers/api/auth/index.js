const {login} = require ('./login');
const {registerStudent} = require ('./registerStudent');
const {registerTeacher} = require ('./registerTeacher');

module.exports = {
    login,
    register: {
        registerStudent,
        registerTeacher
    }
};