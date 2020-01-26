const mongoose = require ('mongoose');
const Student = require ('./student');

const GroupSchema = mongoose.Schema ({
    name: {
        type: String,
        require: true,
        min: 2
    },
    students: {
        type: [Student],
        default: []
    }
});

const groupModel = mongoose.model ('Group', GroupSchema);

module.exports = groupModel;