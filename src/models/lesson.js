const mongoose = require ('mongoose');

const lessonSchema = mongoose.Schema ({});

const lessonModel = mongoose.model ('Lesson', lessonSchema);

module.exports = lessonModel;