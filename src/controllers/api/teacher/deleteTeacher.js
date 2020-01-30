const { isEmail } = require('validator');
const mongoose = require('mongoose');
const { deleteOneDocFromDb, readOneDocFromDb } = require('../../../db/index');
require('../../../models/index');

const Teacher = mongoose.model('Teacher');
const User = mongoose.model('User');

const validData = (email) => {
  let message;
  if (!isEmail(email)) {
    message = 'Incorrect email';
  }
  return { message };
};


module.exports = async (req, res) => {
  try {
    const { email } = req.body;

    const validatedInput = validData(email);
    if (validatedInput) {
      return res.status(400)
        .json(validatedInput);
    }

    const candidate = await readOneDocFromDb(User, {
      email,
      role: 'teacher',
    });
    if (!candidate) {
      return res.status(400)
        .json({ message: 'This teacher doesn\'t found' });
    }

    await deleteOneDocFromDb(Teacher, { _user: candidate._id });
    await deleteOneDocFromDb(User, { email });

    return res.status(201)
      .json({ message: 'Teacher was successfully deleted' });
  } catch (e) {
    console.log(e);
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
