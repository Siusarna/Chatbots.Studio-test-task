const mongoose = require('mongoose');
const { readDocFromDb, readOneDocFromDb } = require('../../../db/index');
require('../../../models/index');

const Student = mongoose.model('Student');
const User = mongoose.model('User');

const createUserForResponse = async (user, usersListWithGroupName) => {
  const { group } = await readOneDocFromDb(Student, { _user: user._id }, 'group');
  const userWithGroupName = {
    _id: user.id,
    email: user.email,
    name: user.name,
    group: group.name,
    created: user.created,
  };
  usersListWithGroupName.push(userWithGroupName);
};

module.exports = async (req, res) => {
  try {
    const users = await readDocFromDb(User, { role: 'student' });
    const usersListWithGroupName = [];
    const promises = users.map((user) => createUserForResponse(user, usersListWithGroupName));
    await Promise.all(promises);
    return res.status(200)
      .json(usersListWithGroupName);
  } catch (e) {
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
