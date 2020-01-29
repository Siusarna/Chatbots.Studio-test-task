const mongoose = require ('mongoose');
const {isLength} = require ('validator');
const isTime = require ('./isTime');
const {readOneDocFromDb, createDocInDb, updateOneDocInDb} = require ('../../../db');
require ('../../../models');

const Teacher = mongoose.model ('Teacher');
const User = mongoose.model ('User');
const Group = mongoose.model ('Group');
const Lesson = mongoose.model ('Lesson');

const validData = (subject, classroom, startTime, endTime) => {
    if (!isLength (subject, {min: 4})) {
        return {message: 'The subject name is too short'};
    }
    if (!isTime (startTime)) {
        return {message: 'Incorrect start time'};
    }
    if (!isTime (endTime)) {
        return {message: 'Incorrect end time'};
    }
    if (!classroom) {
        return {message: 'Field "Classroom" is required'};
    }
};

module.exports = async (req, res) => {
    try {
        const {subject, teacher, group, classroom, startTime, endTime} = req.body;

        const validatedInput = validData (subject, classroom, startTime, endTime);
        if (validatedInput) {
            return res.status (400).json (validatedInput);
        }

        const groupCandidate = await readOneDocFromDb (Group, {name: group});
        if (!groupCandidate) {
            return res.status (400).json ({message: 'This group doesn\'t found'});
        }

        const userForTeacherCandidate = await readOneDocFromDb (User, {email: teacher, role: 'teacher'});
        if (!userForTeacherCandidate) {
            return res.status (400).json ({message: 'This teacher doesn\'t found'});
        }
        const teacherCandidate = await readOneDocFromDb (Teacher, {_user: userForTeacherCandidate._id});

        const lesson = await createDocInDb (Lesson, {
            subject,
            teacher: teacherCandidate._id,
            group: groupCandidate._id,
            classroom,
            startTime,
            endTime
        });

        groupCandidate.lessons.push (lesson);
        teacherCandidate.lessons.push (lesson);
        await updateOneDocInDb (Group, {name: group}, {lessons: groupCandidate.lessons});
        await updateOneDocInDb (Teacher, {_user: userForTeacherCandidate._id}, {lessons: teacherCandidate.lessons});

        res.status (201).json ({message: 'Lesson was successfully created'});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};