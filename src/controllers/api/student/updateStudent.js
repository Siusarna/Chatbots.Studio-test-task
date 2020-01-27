const bcrypt = require ('bcryptjs');
const {isEmail, isLength} = require ('validator');
const {updateOneDocInDb, readOneDocFromDb} = require ('../../../db/index');
const mongoose = require ('mongoose');
require ('../../../models/index');

const Group = mongoose.model ('Group');
const User = mongoose.model ('User');
const Student = mongoose.model ('Student');

const validData = (email, newEmail = 'a@a.com', password = '123456', newPassword = '123456', newName = 'asdf') => {
    if (!isEmail (email)) {
        return {message: 'Incorrect email'};
    }
    if (!isEmail (newEmail)) {
        return {message: 'Incorrect new email'};
    }
    if (newPassword && !password) {
        return {message: 'Field old password is empty'};
    }
    if (!isLength (newPassword, {min: 6})) {
        return {message: 'New password is too short'};
    }
    if (!isLength (newName, {min: 4})) {
        return {message: 'New name is too short'};
    }
};

const hashPass = pass => {
    const salt = bcrypt.genSaltSync (10);
    return bcrypt.hashSync (pass, salt);
};

const deleteStudentFromPreviousGroup = async (previousGroupId, studentId) => {
    const {students} = await readOneDocFromDb (Group, {_id: previousGroupId});
    const newStudentsList = students.filter (obj => String (obj._id) !== String (studentId));
    await updateOneDocInDb (Group, {_id: previousGroupId}, {students: newStudentsList});
};

const addStudentInNewGroup = async (newGroupName, student) => {
    const newGroup = await readOneDocFromDb (Group, {name: newGroupName});
    student.group = newGroup._id;
    newGroup.students.push (student);
    await updateOneDocInDb (Group, {name: newGroupName}, {students: newGroup.students});
    return newGroup._id;
};

const changeGroup = async (newGroup, userId) => {
    const student = await readOneDocFromDb (Student, {_user: userId});
    const group = await readOneDocFromDb (Group, {name: newGroup});
    if (!group) {
        return false;
    }
    await deleteStudentFromPreviousGroup (student.group, student._id);
    const newGroupId = await addStudentInNewGroup (newGroup, student);
    await updateOneDocInDb (Student, {_id: student._id}, {group: newGroupId});
    return true;
};

module.exports = async (req, res) => {
    try {
        const {email, newEmail, password, newPassword, newGroup, newName} = req.body;

        const validatedInput = validData (email, newEmail, password, newPassword, newGroup, newName);
        if (validatedInput) {
            return res.status (400).json (validatedInput);
        }

        const user = await readOneDocFromDb (User, {email});
        if (!user) {
            return res.status (400).json ({message: 'This user doesn\'t found'});
        }

        const objForUser = {
            email: newEmail || email,
            name: newName || user.name
        };

        if (newPassword) {
            const isMatch = await bcrypt.compare (password, user.password);
            if (!isMatch) {
                return res.status (400).json ({message: 'Incorrect email or password for change password'});
            }
            objForUser.password = hashPass (newPassword);
        }

        if (newGroup) {
            const isSuccessfully = await changeGroup (newGroup, user._id);
            if (!isSuccessfully) {
                return res.status (400).json ({message: 'New group doesn\'t found'});
            }
        }
        await updateOneDocInDb (User, {email}, objForUser);

        res.status (201).json ({message: 'Student successfully updated '});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};