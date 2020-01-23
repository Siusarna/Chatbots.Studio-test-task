const mongoose = require ('mongoose');

const UserSchema = new mongoose.Schema ({
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
        type: Date,
        default: Date.now ()
    },
    block: {
        type: Boolean,
        default: false
    }
});

const userModel = mongoose.model ('User', UserSchema);

module.exports = userModel;