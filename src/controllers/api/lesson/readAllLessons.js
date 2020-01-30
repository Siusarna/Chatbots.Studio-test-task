const mongoose = require('mongoose');
const { readDocFromDb, readOneDocFromDb } = require('../../../db/index');
require('../../../models/index');

const Teacher = mongoose.model('Teacher');
const Lesson = mongoose.model('Lesson');
const Group = mongoose.model('Group');

const createLessonForResponse = async (lesson, newLessonsList) => {
  const group = await readOneDocFromDb(Group, { _id: lesson.group });
  const teacher = await readOneDocFromDb(Teacher, { _id: lesson.teacher }, '_user');
  const objWithData = {
    _id: lesson.id,
    subject: lesson.subject,
    group: group.name,
    teacher: teacher._user.name,
    classroom: lesson.classroom,
    startTime: lesson.startTime,
    endTime: lesson.endTime,
  };
  newLessonsList.push(objWithData);
};

module.exports = async (req, res) => {
  try {
    const lessons = await readDocFromDb(Lesson, {});
    const newLessonsList = [];
    const promises = lessons.map((lesson) => createLessonForResponse(lesson, newLessonsList));
    await Promise.all(promises);
    return res.status(200)
      .json(newLessonsList);
  } catch (e) {
    console.log(e);
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
