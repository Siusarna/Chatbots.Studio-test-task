const {isLength} = require ('validator');
const {updateOneDocInDb, readOneDocFromDb} = require ('../../../db/index');
const mongoose = require ('mongoose');
const isTime = require ('./isTime');
require ('../../../models/index');

const Group = mongoose.model ('Group');
const Teacher = mongoose.model ('Teacher');
const Lesson = mongoose.model ('Lesson');
const User = mongoose.model ('User');

const validData = (newSubject = 'test', newStartTime = '00:00', newEndTime = '00:00') => {
    if (!isLength (newSubject, {min: 4})) {
        return {message: 'The subject name is too short'};
    }
    if (!isTime (newStartTime)) {
        return {message: 'Incorrect start time'};
    }
    if (!isTime (newEndTime)) {
        return {message: 'Incorrect end time'};
    }
};

module.exports = async (req, res) => {
    try {
        const {id, newSubject, newGroup, newTeacher, newStartTime, newEndTime, newClassroom} = req.body;

        const validatedInput = validData (newSubject, newStartTime, newEndTime);
        if (validatedInput) {
            return res.status (400).json (validatedInput);
        }

        const lesson = await readOneDocFromDb (Lesson, {_id: id});
        if (!lesson) {
            return res.status (400).json ({message: 'This lesson doesn\'t found'});
        }

        const objWithNewData = {
            subject: newSubject || lesson.subject,
            startTime: newStartTime || lesson.startTime,
            endTime: newEndTime || lesson.endTime,
            classroom: newClassroom || lesson.classroom
        };

        const userForNewTeacher = await readOneDocFromDb (User, {email: newTeacher, role: 'teacher'});
        const newGroupFromDb = await readOneDocFromDb (Group, {name: newGroup});
        const newTeacherFromDb = await readOneDocFromDb (Teacher, {_user: userForNewTeacher._id});
        if (newGroup && !newGroupFromDb) {
            return res.status (400).json ({message: 'New group doesn\'t found'});
        }
        if (newTeacher && !newTeacherFromDb) {
            return res.status (400).json ({message: 'New teacher doesn\'t found'});
        }
        if (newGroup) {
            const previousGroup = await readOneDocFromDb (Group, {_id: lesson.group});
            const newLessonsListForPreviousGroup = previousGroup.lessons.filter (obj => String (obj._id) !== String (lesson._id));
            await updateOneDocInDb (Group, {_id: previousGroup._id}, {lessons: newLessonsListForPreviousGroup});

            newGroupFromDb.lessons.push (lesson._id);
            objWithNewData.group = newGroupFromDb._id || lesson.group;
            await updateOneDocInDb (Group, {_id: newGroupFromDb._id}, {lessons: newGroupFromDb.lessons});
        }
        if (newTeacher) {
            const previousTeacher = await readOneDocFromDb (Teacher, {_id: lesson.teacher});
            const newLessonsListForPreviousTeacher = previousTeacher.lessons.filter (obj => String (obj) !== String (lesson._id));
            await updateOneDocInDb (Teacher, {_id: previousTeacher._id}, {lessons: newLessonsListForPreviousTeacher});

            newTeacherFromDb.lessons.push (lesson._id);
            objWithNewData.teacher = newTeacher || lesson.teacher;
            await updateOneDocInDb (Teacher, {_id: newTeacherFromDb._id}, {lessons: newTeacherFromDb.lessons});
        }

        await updateOneDocInDb (Lesson, {_id: lesson.id}, {objWithNewData});

        res.status (201).json ({message: 'Lesson was successfully updated '});
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};