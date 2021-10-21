const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    item_ids:{
        type: Array,
        required: true  //at least one item is necessary
    }
});

let notes = mongoose.model("notes", notesSchema);

module.exports = notes;