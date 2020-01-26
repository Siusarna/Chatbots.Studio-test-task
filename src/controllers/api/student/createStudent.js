const bcrypt = require ('bcryptjs');
const mongoose = require ('mongoose');
const {isEmail, isLength} = require ('validator');
const {readOneDocFromDb, createDocInDb, updateOneDocInDb} = require ('../../../db');
require ('../../../models');

const Student = mongoose.model ('Student');
const User = mongoose.model ('User');
const Group = mongoose.model ('Group');

const validData = (name, email, pass, group) => {
    if (!isEmail (email)) {
        return {message: 'Wrong email'};
    }
    if (!isLength (pass, {min: 6})) {
        return {message: 'The password is too short'};
    }
    if (!isLength (name, {min: 4})) {
        return {message: 'The name is too short'};
    }
    if (!group) {
        return {message: 'Field "Group" is required'};
    }
};

const hashPass = pass => {
    const salt = bcrypt.genSaltSync (10);
    return bcrypt.hashSync (pass, salt);
};


const createStudent = async (req, res) => {
    try {
        const {name, email, password, groupName} = req.body;

        const validatedInput = validData (name, email, password, group);
        if (validatedInput) {
            return res.status (400).json (validatedInput);
        }

        const candidate = await readOneDocFromDb (User, {email});
        if (candidate) {
            return res.status (400).json ({message: 'User already exists'});
        }

        const group = await readOneDocFromDb (Group, {groupName});
        if (!group) {
            return res.status (400).json ({message: 'This group doesn\'t exist'});
        }

        const hashedPassword = hashPass (password);
        const user = await createDocInDb (User, {email, password: hashedPassword, name, role: 'student'});
        const student = await createDocInDb (Student, {_user: user._id, group: group._id});
        group.students.push (student);
        await updateOneDocInDb (Group, {groupName}, {students: group.students});

        res.status (201).json ({message: 'registration was successful'});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};

module.exports = {
    createStudent
};