const mongoose = require('mongoose');
const { readDocFromDb } = require('../../../db/index');
require('../../../models/index');

const Group = mongoose.model('Group');

module.exports = async (req, res) => {
  try {
    const groups = await readDocFromDb(Group, {});

    res.status(200)
      .json(groups);
  } catch (e) {
    res.status(500)
      .json({ message: 'Something went wrong' });
  }
};
