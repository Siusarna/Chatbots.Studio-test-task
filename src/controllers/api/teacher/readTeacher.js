const mongoose = require('mongoose');
const { readOneDocFromDb } = require('../../../db/index');
require('../../../models/index');

const Teacher = mongoose.model('Teacher');
const User = mongoose.model('User');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await readOneDocFromDb(User, {
      _id: id,
      role: 'teacher',
    });
    if (!user) {
      return res.status(400)
        .json({ message: 'Teacher with this id doesn\'t found' });
    }
    const { age, subject, experience } = await readOneDocFromDb(Teacher, { _user: user._id });
    const teacher = {
      _id: user.id,
      email: user.email,
      name: user.name,
      age,
      subject,
      experience,
      created: user.created,
    };
    return res.status(200)
      .json(teacher);
  } catch (e) {
    console.log(e);
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
