const {readOneDocFromDb} = require ('../../../db/index');
const mongoose = require ('mongoose');
require ('../../../models/index');

const Teacher = mongoose.model ('Teacher');
const Group = mongoose.model ('Group');
const Lesson = mongoose.model ('Lesson');

module.exports = async (req, res) => {
    try {
        const {id} = req.params;

        const lesson = await readOneDocFromDb (Lesson, {_id: id});
        if (!lesson) {
            return res.status (400).json ({message: 'Lesson with this id doesn\'t found'});
        }

        const group = await readOneDocFromDb (Group, {_id: lesson.group});
        const teacher = await readOneDocFromDb (Teacher, {_id: lesson.teacher}, '_user');
        const objForResponse = {
            _id: lesson.id,
            subject: lesson.subject,
            group: group.name,
            teacher: teacher._user.name,
            classroom: lesson.classroom,
            startTime: lesson.startTime,
            endTime: lesson.endTime
        };
        res.status (200).json (objForResponse);
    } catch (e) {
        console.log (e);
        res.status (500).json ({message: 'Something went wrong'});
    }
};