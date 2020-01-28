const {isLength} = require ('validator');
const {deleteOneDocFromDb, readOneDocFromDb, updateOneDocInDb} = require ('../../../db/index');
const mongoose = require ('mongoose');
require ('../../../models/index');

const Group = mongoose.model ('Group');
const Student = mongoose.model ('Student');

const validData = (name) => {
    if (!isLength (name, {min: 2})) {
        return {message: 'The group name is too short'};
    }
};

const deleteGroupInPreviousStudent = async (group) => {
    const {students} = group;
    for (const student of students) {
        await updateOneDocInDb (Student, {_id: student._id}, {group: null});
    }
};

module.exports = async (req, res) => {
    try {
        const {name} = req.body;

        const validatedInput = validData (name);
        if (validatedInput) {
            return res.status (400).json (validatedInput);
        }

        const candidate = await readOneDocFromDb (Group, {name});
        if (!candidate) {
            return res.status (400).json ({message: 'This group doesn\'t found'});
        }

        await deleteGroupInPreviousStudent (candidate);
        await deleteOneDocFromDb (Group, {name});

        res.status (201).json ({message: 'Group successfully deleted'});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};