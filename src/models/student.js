const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Group',
  },
});

const studentModel = mongoose.model('Student', StudentSchema);

module.exports = studentModel;
