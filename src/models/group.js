const mongoose = require ('mongoose');

const StudentSchema = new mongoose.Schema ({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Group'
    }
});

const GroupSchema = mongoose.Schema ({
    name: {
        type: String,
        require: true,
        min: 2
    },
    students: {
        type: [StudentSchema],
        default: []
    }
});

const groupModel = mongoose.model ('Group', GroupSchema);

module.exports = groupModel;