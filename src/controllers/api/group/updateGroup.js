const { isLength } = require('validator');
const mongoose = require('mongoose');
const { updateOneDocInDb, readOneDocFromDb } = require('../../../db/index');
require('../../../models/index');

const Group = mongoose.model('Group');
const User = mongoose.model('User');
const Student = mongoose.model('Student');

const validData = (name) => {
  let message;
  if (!isLength(name, { min: 2 })) {
    message = 'The group name is too short';
  }
  return message;
};

const createStudentsList = async (student, successful, failed) => {
  const user = await readOneDocFromDb(User, {
    email: student,
    role: 'student',
  });
  if (user) {
    successful.push(await readOneDocFromDb(Student, { _user: user._id }));
  } else {
    failed.push(student);
  }
};

const createStudentsArray = async (students) => {
  const failed = [];
  const successful = [];
  const promises = students.map((student) => createStudentsList(student, successful, failed));
  await Promise.all(promises);
  return {
    failed,
    successful,
  };
};

const updateStudentsList = async (student) => {
  await updateOneDocInDb(Student, { _id: student._id }, { group: null });
};

const deleteGroupInPreviousStudents = async (groupId) => {
  const { students } = await readOneDocFromDb(Group, { _id: groupId });
  const promises = students.map(updateStudentsList);
  await Promise.all(promises);
};

const deleteStudentFromGroup = async (student) => {
  const group = await readOneDocFromDb(Group, { _id: student.group });
  const newStudentsList = group.students.filter((obj) => String(obj._id) !== String(student._id));
  await updateOneDocInDb(Group, { _id: group._id }, { students: newStudentsList });
};

const deleteStudentsFromPreviousGroup = async (successful) => {
  const promises = successful.map(deleteStudentFromGroup);
  await Promise.all(promises);
};

const createListWithUpdatedGroup = async (student, groupId, listWithUpdatedGroup) => {
  listWithUpdatedGroup.push(await updateOneDocInDb(Student, { _id: student._id }, { group: groupId }));
};

const addNewGroupForStudents = async (groupId, successfulStudents) => {
  const listWithUpdatedGroup = [];
  const promises = successfulStudents.map((student) => createListWithUpdatedGroup(student, groupId, listWithUpdatedGroup));
  await Promise.all(promises);
  return listWithUpdatedGroup;
};

module.exports = async (req, res) => {
  try {
    const { name, students } = req.body;

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

    const { failed, successful } = await createStudentsArray(students);
    if (failed.length) {
      return res.status(400)
        .json({ message: `This students doesn't found: ${JSON.stringify(failed)}` });
    }

    await deleteGroupInPreviousStudents(candidate._id);
    await deleteStudentsFromPreviousGroup(successful);
    const studentListWithUpdatedGroup = await addNewGroupForStudents(candidate._id, successful);
    await updateOneDocInDb(Group, { name }, { students: studentListWithUpdatedGroup });

    return res.status(201)
      .json({ message: 'Group was successfully updated ' });
  } catch (e) {
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
