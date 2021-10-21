const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemsSchema = new Schema({
    checked:{
        type: Boolean,
        required: true,
        default: false
    },
    message: String,
    noteId: {
        type: String,
        required: true
    },
    color: {
        type: Object,
        default:{
            "R": {
                type: Number,
                default: 255
            },
            "G": {
                type: Number,
                default: 255
            },
            "B": {
                type: Number,
                default: 255
            }
        }
    },
    images: String
});

let items = mongoose.model("items", itemsSchema);

module.exports = items;