const mongoose = require ('mongoose');

const lessonSchema = mongoose.Schema ({
    subject: {
        type: String,
        require: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        require: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        require: true
    },
    classroom: {
        type: String,
        require: true
    },
    startTime: {
        type: String,
        require: true
    },
    endTime: {
        type: String,
        require: false
    }
});

const lessonModel = mongoose.model ('Lesson', lessonSchema);

module.exports = lessonModel;