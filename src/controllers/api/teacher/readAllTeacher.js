const mongoose = require('mongoose');
const { readDocFromDb, readOneDocFromDb } = require('../../../db/index');
require('../../../models/index');

const Teacher = mongoose.model('Teacher');
const User = mongoose.model('User');

const createTeacherForResponse = async (user, teachers) => {
  const { age, subject, experience } = await readOneDocFromDb(Teacher, { _user: user._id });
  const userWithAllData = {
    _id: user.id,
    email: user.email,
    name: user.name,
    age,
    subject,
    experience,
    created: user.created,
  };
  teachers.push(userWithAllData);
};

module.exports = async (req, res) => {
  try {
    const users = await readDocFromDb(User, { role: 'teacher' });
    const teachers = [];
    const promises = users.map((user) => createTeacherForResponse(user, teachers));
    await Promise.all(promises);
    return res.status(200)
      .json(teachers);
  } catch (e) {
    console.log(e);
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
