const { isLength } = require('validator');
const mongoose = require('mongoose');
const { readOneDocFromDb } = require('../../../db/index');
require('../../../models/index');

const Group = mongoose.model('Group');

const validData = (name) => {
  let message;
  if (!isLength(name, { min: 2 })) {
    message = 'The group name is too short';
  }
  return message;
};

module.exports = async (req, res) => {
  try {
    const { name } = req.params;

    const validatedInput = validData(name);
    if (validatedInput) {
      return res.status(400)
        .json({ message: validatedInput });
    }
    const group = await readOneDocFromDb(Group, { name });
    if (!group) {
      return res.status(400)
        .json({ message: 'This group doesn\'t found' });
    }

    return res.status(200)
      .json(group);
  } catch (e) {
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
