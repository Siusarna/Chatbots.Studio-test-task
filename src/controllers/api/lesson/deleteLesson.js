const mongoose = require('mongoose');
const { deleteOneDocFromDb, readOneDocFromDb, updateOneDocInDb } = require('../../../db/index');
require('../../../models/index');

const Teacher = mongoose.model('Teacher');
const Group = mongoose.model('Group');
const Lesson = mongoose.model('Lesson');


module.exports = async (req, res) => {
  try {
    const { id } = req.body;

    const lesson = await readOneDocFromDb(Lesson, { _id: id });
    if (!lesson) {
      return res.status(400)
        .json({ message: 'This lesson doesn\'t found' });
    }

    const teacher = await readOneDocFromDb(Teacher, { _id: lesson.teacher });
    const newLessonsListForTeacher = teacher.lessons.filter(
      (obj) => String(obj._id) !== String(lesson._id),
    );
    await updateOneDocInDb(Teacher, { _id: teacher._id }, { lessons: newLessonsListForTeacher });

    const group = await readOneDocFromDb(Teacher, { _id: lesson.group });
    const newLessonsListForGroup = group.lessons.filter(
      (obj) => String(obj._id) !== String(lesson._id),
    );
    await updateOneDocInDb(Group, { _id: group._id }, { lessons: newLessonsListForGroup });

    await deleteOneDocFromDb(Lesson, { _id: id });

    return res.status(201)
      .json({ message: 'Lesson successfully deleted' });
  } catch (e) {
    console.log(e);
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
