const {isLength} = require ('validator');
const {updateOneDocInDb, readOneDocFromDb} = require ('../../../db/index');
const mongoose = require ('mongoose');
require ('../../../models/index');

const Group = mongoose.model ('Group');
const User = mongoose.model ('User');

const validData = (name) => {
    if (!isLength (name, {min: 2})) {
        return {message: 'The group name is too short'};
    }
};

const createStudentsArray = async (students) => {
    const failed = [];
    const successfully = [];
    for (const student of students) {
        const user = await readOneDocFromDb (User, {email: student});
        if (user && user.role === 'student') {
            successfully.push (user);
        } else {
            failed.push (student);
        }
    }
    return {failed, successfully};
};

module.exports = async (req, res) => {
    try {
        const {name, students} = req.body;

        const validatedInput = validData (name);
        if (validatedInput) {
            return res.status (400).json (validatedInput);
        }

        const candidate = await readOneDocFromDb (Group, {name});
        if (!candidate) {
            return res.status (400).json ({message: 'This group doesn\'t found'});
        }

        const {failed, successfully} = await createStudentsArray (students);
        if (failed.length) {
            return res.status (400).json ({message: `This students doesn\'t found: ${JSON.stringify (failed)}`});
        }

        await updateOneDocInDb (Group, {name}, {students: successfully});

        res.status (201).json ({message: 'Group successfully updated '});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};