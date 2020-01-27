const {isEmail} = require ('validator');
const {deleteOneDocFromDb, readOneDocFromDb, updateOneDocInDb} = require ('../../../db/index');
const mongoose = require ('mongoose');
require ('../../../models/index');

const User = mongoose.model ('User');
const Student = mongoose.model ('Student');
const Group = mongoose.model ('Group');

const validData = (email) => {
    if (!isEmail (email)) {
        return {message: 'Incorrect email'};
    }
};

module.exports = async (req, res) => {
    try {
        const {email} = req.body;

        const validatedInput = validData (email);
        if (validatedInput) {
            return res.status (400).json (validatedInput);
        }

        const user = await readOneDocFromDb (User, {email, role: 'student'});
        if (!user) {
            return res.status (400).json ({message: 'This student doesn\'t found'});
        }

        const student = await readOneDocFromDb (Student, {_user: user._id}, 'group');
        const {students} = student.group;
        const newStudentsList = students.filter (obj => String (obj._id) !== String (student._id));

        await updateOneDocInDb (Group, {_id: student.group._id}, {students: newStudentsList});
        await deleteOneDocFromDb (User, {email});
        await deleteOneDocFromDb (Student, {_id: student._id});

        res.status (201).json ({message: 'Student successfully deleted'});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};