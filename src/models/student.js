const mongoose = require ('mongoose');

const StudentSchema = new mongoose.Schema ({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    group: {
        type: String,
        require: true
    }
});

const studentModel = mongoose.model ('Student', StudentSchema);

module.exports = studentModel;