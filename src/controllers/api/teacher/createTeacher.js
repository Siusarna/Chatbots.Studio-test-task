const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { isEmail, isLength } = require('validator');
const config = require('../../../config/default');
const { readOneDocFromDb, createDocInDb } = require('../../../db');
require('../../../models');

const Teacher = mongoose.model('Teacher');
const User = mongoose.model('User');

const validData = (name, email, pass, age, subject) => {
  let message;
  if (!isEmail(email)) {
    message = 'Wrong email';
  }
  if (!isLength(pass, { min: 6 })) {
    message = 'The password is too short';
  }
  if (!isLength(name, { min: 4 })) {
    message = 'The name is too short';
  }
  if (age < config.minimumTeacherAge) {
    message = 'Teacher is too young';
  }
  if (!subject) {
    message = 'Field "Subject" is required';
  }
  return message;
};

const hashPass = (pass) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pass, salt);
};

module.exports = async (req, res) => {
  try {
    const {
      name, email, password, age, subject, experience,
    } = req.body;

    const validatedInput = validData(name, email, password, age, subject);
    if (validatedInput) {
      return res.status(400)
        .json({ message: validatedInput });
    }

    const candidate = await readOneDocFromDb(User, { email });
    if (candidate) {
      return res.status(400)
        .json({ message: 'User already exists' });
    }
    const hashedPassword = hashPass(password);
    const user = await createDocInDb(User, {
      email,
      password: hashedPassword,
      name,
      role: 'teacher',
    });
    await createDocInDb(Teacher, {
      _user: user._id,
      subject,
      age,
      experience,
    });

    return res.status(201)
      .json({ message: 'New teacher was successfully created' });
  } catch (e) {
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
