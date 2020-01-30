const { isLength } = require('validator');
const mongoose = require('mongoose');
const { deleteOneDocFromDb, readOneDocFromDb, updateOneDocInDb } = require('../../../db/index');
require('../../../models/index');

const Group = mongoose.model('Group');
const Student = mongoose.model('Student');

const validData = (name) => {
  let message;
  if (!isLength(name, { min: 2 })) {
    message = 'The group name is too short';
  }
  return message;
};

const updateStudentsList = async (student) => {
  await updateOneDocInDb(Student, { _id: student._id }, { group: null });
};

const deleteGroupInPreviousStudent = async (group) => {
  const { students } = group;
  const promises = students.map(updateStudentsList);
  await Promise.all(promises);
};

module.exports = async (req, res) => {
  try {
    const { name } = req.body;

    const validatedInput = validData(name);
    if (validatedInput) {
      return res.status(400)
        .json({ message: validatedInput });
    }

    const candidate = await readOneDocFromDb(Group, { name });
    if (!candidate) {
      return res.status(400)
        .json({ message: 'This group doesn\'t found' });
    }

    await deleteGroupInPreviousStudent(candidate);
    await deleteOneDocFromDb(Group, { name });

    return res.status(201)
      .json({ message: 'Group was successfully deleted' });
  } catch (e) {
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
