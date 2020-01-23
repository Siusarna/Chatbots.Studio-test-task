const bcrypt = require ('bcryptjs');
const mongoose = require ('mongoose');
const {isEmail, isLength} = require ('validator');
const {readOneDocFromDb, createDocInDb} = require ('../../../db/index');
require ('../../../models/index');

const User = mongoose.model ('User');

const validData = (name, email, pass) => {
    if (!isEmail (email)) {
        return {message: 'Wrong email'};
    }
    if (!isLength (pass, {min: 6})) {
        return {message: 'The password is too short'};
    }
    if (!isLength (name, {min: 4})) {
        return {message: 'The name is too short'};
    }
};

const hashPass = pass => {
    const salt = bcrypt.genSaltSync (10);
    return bcrypt.hashSync (pass, salt);
};

const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const validatedInput = validData (name, email, password);
        if (validatedInput) {
            res.status (400).json (validatedInput);
        }

        const candidate = await readOneDocFromDb (User, {email});
        if (candidate) {
            return res.status (400).json ({message: 'User already exists'});
        }
        const hashedPassword = hashPass (password);
        await createDocInDb (User, {name, email, password: hashedPassword});

        res.status (201).json ({message: 'registration was successful'});
    } catch (e) {
        res.status (500).json ({message: 'Something went wrong'});
    }
};

module.exports = {
    register
};