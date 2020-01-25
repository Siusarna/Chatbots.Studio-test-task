const bcrypt = require ('bcryptjs');
const mongoose = require ('mongoose');
const {isEmail, isLength} = require ('validator');
const {readOneDocFromDb, createDocInDb} = require ('../../../db/index');
require ('../../../models/index');

const Student = mongoose.model ('Student');
const User = mongoose.model ('User');

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

const registerStudent = async (req, res) => {
    try {
        const {name, email, password, group} = req.body;

        const validatedInput = validData (name, email, password, group);
        if (validatedInput) {
            return res.status (400).json (validatedInput);
        }

        const candidate = await readOneDocFromDb (User, {email});
        if (candidate) {
            return res.status (400).json ({message: 'User already exists'});
        }
        const hashedPassword = hashPass (password);
        const user = await createDocInDb (User, {email, password: hashedPassword, name, role: 'student'});
        await createDocInDb (Student, {_user: user._id, group});

        res.status (201).json ({message: 'registration was successful'});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};

module.exports = {
    registerStudent
};