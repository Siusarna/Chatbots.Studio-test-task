const bcrypt = require ('bcryptjs');
const mongoose = require ('mongoose');
const config = require ('../../../config/default');
const {isEmail, isLength} = require ('validator');
const {readOneDocFromDb, createDocInDb} = require ('../../../db');
require ('../../../models');

const Teacher = mongoose.model ('Teacher');
const User = mongoose.model ('User');

const validData = (name, email, pass, age, subject) => {
    if (!isEmail (email)) {
        return {message: 'Wrong email'};
    }
    if (!isLength (pass, {min: 6})) {
        return {message: 'The password is too short'};
    }
    if (!isLength (name, {min: 4})) {
        return {message: 'The name is too short'};
    }
    if (age < config.minimumTeacherAge) {
        return {message: 'Teacher is too young'};
    }
    if (!subject) {
        return {message: 'Field "Subject" is required'};
    }
};

const hashPass = pass => {
    const salt = bcrypt.genSaltSync (10);
    return bcrypt.hashSync (pass, salt);
};

const createTeacher = async (req, res) => {
    try {
        const {name, email, password, age, subject} = req.body;

        const validatedInput = validData (name, email, password, age, subject);
        if (validatedInput) {
            return res.status (400).json (validatedInput);
        }

        const candidate = await readOneDocFromDb (Teacher, {email});
        if (candidate) {
            return res.status (400).json ({message: 'User already exists'});
        }
        const hashedPassword = hashPass (password);
        const user = await createDocInDb (User, {email, password: hashedPassword, name, role: 'teacher'});
        await createDocInDb (Teacher, {_user: user._id, subject, age});

        res.status (201).json ({message: 'registration was successful'});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};

module.exports = {
    createTeacher
};