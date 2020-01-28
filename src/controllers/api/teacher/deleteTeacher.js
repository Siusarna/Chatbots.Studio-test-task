const {isEmail} = require ('validator');
const {deleteOneDocFromDb, readOneDocFromDb} = require ('../../../db/index');
const mongoose = require ('mongoose');
require ('../../../models/index');

const Teacher = mongoose.model ('Teacher');
const User = mongoose.model ('User');

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

        const candidate = await readOneDocFromDb (User, {email, role: 'teacher'});
        if (!candidate) {
            return res.status (400).json ({message: 'This teacher doesn\'t found'});
        }

        await deleteOneDocFromDb (Teacher, {_user: candidate._id});
        await deleteOneDocFromDb (User, {email});

        res.status (201).json ({message: 'Teacher successfully deleted'});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};