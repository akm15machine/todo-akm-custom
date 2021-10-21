const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    phone: String,
    note_ids:{
        type: Array
    }
});

let users = mongoose.model("users", usersSchema);

module.exports = users;