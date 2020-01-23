const mongoose = require ('mongoose');

const UserSchema = new mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true,
        min: 4
    },
    email: {
        type: String,
        require: true,
        max: 1024,
        min: 6
    },
    password: {
        type: String,
        require: true,
        min: 8,
        max: 1024
    },
    created: {
        type: Data,
        default: Date.now ()
    },
    block: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model ('User', UserSchema);