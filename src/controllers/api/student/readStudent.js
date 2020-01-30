const mongoose = require('mongoose');
const { readOneDocFromDb } = require('../../../db/index');
require('../../../models/index');

const Student = mongoose.model('Student');
const User = mongoose.model('User');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await readOneDocFromDb(User, {
      _id: id,
      role: 'student',
    });
    if (!user) {
      return res.status(400)
        .json({ message: 'Student with this id doesn\'t found' });
    }
    const { group } = await readOneDocFromDb(Student, { _user: user._id }, 'group');
    const student = {
      _id: user.id,
      email: user.email,
      name: user.name,
      group: group.name,
      created: user.created,
    };
    return res.status(200)
      .json(student);
  } catch (e) {
    console.log(e);
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
