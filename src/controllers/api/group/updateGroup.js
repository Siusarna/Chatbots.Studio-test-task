const {isLength} = require ('validator');
const {updateOneDocInDb, readOneDocFromDb} = require ('../../../db/index');
const mongoose = require ('mongoose');
require ('../../../models/index');

const Group = mongoose.model ('Group');
const User = mongoose.model ('User');
const Student = mongoose.model ('Student');

const validData = (name) => {
    if (!isLength (name, {min: 2})) {
        return {message: 'The group name is too short'};
    }
};

const createStudentsArray = async (students) => {
    const failed = [];
    const successful = [];
    for (const student of students) {
        const user = await readOneDocFromDb (User, {email: student, role: 'student'});
        if (user) {
            successful.push (await readOneDocFromDb (Student, {_user: user._id}));
        } else {
            failed.push (student);
        }
    }
    return {failed, successful};
};

const deleteGroupInPreviousStudent = async (groupId) => {
    const {students} = await readOneDocFromDb (Group, {_id: groupId});
    for (const student of students) {
        await updateOneDocInDb (Student, {_id: student._id}, {group: null});
    }
};

const addNewGroupForStudents = async (newGroupName, successfulStudents) => {
    const newGroup = await readOneDocFromDb (Group, {name: newGroupName});
    const listWithUpdatedGroup = [];
    for (const student of successfulStudents) {
        listWithUpdatedGroup.push (await updateOneDocInDb (Student, {_id: student._id}, {group: newGroup._id}));
    }
    return listWithUpdatedGroup;
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

        const {failed, successful} = await createStudentsArray (students);
        if (failed.length) {
            return res.status (400).json ({message: `This students doesn\'t found: ${JSON.stringify (failed)}`});
        }

        await deleteGroupInPreviousStudent (candidate._id);
        const studentListWithUpdatedGroup = await addNewGroupForStudents (name, successful);
        await updateOneDocInDb (Group, {name}, {students: studentListWithUpdatedGroup});

        res.status (201).json ({message: 'Group was successfully updated '});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};