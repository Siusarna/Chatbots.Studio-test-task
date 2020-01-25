const mongoose = require ('mongoose');
const config = require ('../config/default');

const TeacherSchema = new mongoose.Schema ({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    age: {
        type: Number,
        require: true,
        min: config.minimumTeacherAge
    },
    subject: {
        type: String,
        require: true
    },
    experience: {
        type: Number,
        default: 0
    }
});

const teacherModel = mongoose.model ('Teacher', TeacherSchema);

module.exports = teacherModel;