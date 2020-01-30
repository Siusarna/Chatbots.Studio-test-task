const bcrypt = require('bcryptjs');
const { isEmail, isLength } = require('validator');
const mongoose = require('mongoose');
const { updateOneDocInDb, readOneDocFromDb } = require('../../../db/index');
const config = require('../../../config/default');
require('../../../models/index');

const User = mongoose.model('User');
const Teacher = mongoose.model('Teacher');

const validData = (
  email,
  newEmail = 'a@a.com',
  password = '123456',
  newPassword = '123456',
  newName = 'asdf',
  newAge,
  newSubject,
) => {
  let message;
  if (!isEmail(email)) {
    message = 'Incorrect email';
  }
  if (!isEmail(newEmail)) {
    message = 'Incorrect new email';
  }
  if (newPassword && !password) {
    message = 'Field old password is empty';
  }
  if (!isLength(newPassword, { min: 6 })) {
    message = 'New password is too short';
  }
  if (!isLength(newName, { min: 4 })) {
    message = 'New name is too short';
  }
  if (newAge < config.minimumTeacherAge) {
    message = 'Teacher is too young';
  }
  if (!newSubject) {
    message = 'Field "Subject" is required';
  }
  return { message };
};

const hashPass = (pass) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pass, salt);
};

module.exports = async (req, res) => {
  try {
    const {
      email, newEmail, password, newPassword, newName, newSubject, newExperience, newAge,
    } = req.body;

    const validatedInput = validData(
      email,
      newEmail,
      password,
      newPassword,
      newName,
      newSubject,
      newExperience,
      newAge,
    );
    if (validatedInput) {
      return res.status(400)
        .json(validatedInput);
    }

    const user = await readOneDocFromDb(User, {
      email,
      role: 'teacher',
    });
    if (!user) {
      return res.status(400)
        .json({ message: 'This user doesn\'t found' });
    }

    const teacher = readOneDocFromDb(Teacher, { _user: user._id });

    const objForUser = {
      email: newEmail || email,
      name: newName || user.name,
    };

    const objForTeacher = {
      subject: newSubject || teacher.subject,
      experience: newExperience || teacher.experience,
      age: newAge || teacher.age,
    };

    if (newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400)
          .json({ message: 'Incorrect email or password for change password' });
      }
      objForUser.password = hashPass(newPassword);
    }

    const newUser = await updateOneDocInDb(User, { email }, objForUser);
    await updateOneDocInDb(Teacher, { _user: newUser._id }, objForTeacher);

    return res.status(201)
      .json({ message: 'Teacher was successfully updated ' });
  } catch (e) {
    console.log(e);
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
