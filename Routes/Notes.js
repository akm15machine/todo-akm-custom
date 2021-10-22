//  Standard Modules
const router = require("express").Router();
const chalk = require('chalk');
const bcrypt = require('bcrypt');
require('dotenv').config();

//Mongoose models
const users = require('../Models/users')
const notes = require('../Models/notes')
const items = require('../Models/items')

// Globals

// Create new note
router.post('/', async (req, res) => {
    try {
        const { name, itemMsgs, user } = req.body;
        /**
         * name = Name of the note
         * itemMsgs = [
         *      {message:String, Cokor: Object},
         *      {message:String, Cokor: Object}, etc.
         * ]
         * user = {
         *      "name": "the name",
         *      "email": "the email",
         *      "phone": "number"
         * }
         */
        if (!name || !itemMsgs || !user)
            return res.status(400).json({
                message: `Please provide the details to create note`
            });

        const userLoggedIn = await users.findOne({ name: user.name }); //JWT to be implemented
        if (userLoggedIn) {
            const newNote = new notes({ name });
            // push note id to the logged user
            userLoggedIn.note_ids.push(Object(newNote._id));
            //assign user id to newNote
            newNote.user_id = userLoggedIn._id;
            // to store the item ids
            const itemIds = []
            // for each item supplied
            itemMsgs.forEach(async item => {
                const newItem = new items({
                    message: item.message,
                    note_id: newNote.id,
                    color: { R: item.color.R ?? 255, G: item.color.G ?? 255, B: item.color.B ?? 255 }
                });
                // When the item variable is saved, its better to take the id from the returned variable so that 
                // it's actually the one stored in the DB not the one made by the model.
                const savedItem = await newItem.save();
                //store the ids, later required for mapping
                itemIds.push(savedItem._id);
            });

            // array of item Ids assigned to the new note
            newNote.item_ids = itemIds;
            // save the note
            await newNote.save().catch(err => {
                return res.status(500).json({
                    message: `Couldn't save note, DB error!`,
                    error: err
                });
            });

            await userLoggedIn.save().catch(err => {
                return res.status(500).json({
                    message: `Could not save to user, DB error!`,
                    error: err
                });
            })
            return res.status(200).json({
                message: `Note created for ${user.name}`
            });
        }
        else return res.status(401).json({
            message: `You need to login to save note`
        });
    } catch (err) {
        return res.status(500).json({
            message: `Internal error`,
            error: err
        });
    }
});

// Read note
// responds with all the items
router.get('/:notename', async (req, res) => {
    try {
        const name = req.params.notename;
        const { user } = req.body;
        // find the given user
        var findUser;
        if (user.name)
            findUser = await users.findOne({ name: user.name });
        else if (user.email)
            findUser = await users.findOne({ email: user.email });
        else if (user.phone)
            findUser = await users.findOne({ phone: user.phone });
        else
            return res.status(401).json({
                message: `Unauthorised access`
            });
        if (!findUser)
            return res.status(401).json({
                message: `User not found in database`
            })
        // fetch all the ids from this user
        const idsFromUser = findUser.note_ids;
        // all the notes with the same name under this user
        const findNote = await notes.find({ name, _id: idsFromUser });
        if (findNote) {
            const _id = [];
            await findNote.forEach(note_elem => {
                _id.push(...note_elem.item_ids);
            });
            const findItems = await items.find({ _id });
            res.status(200).json(findItems);
        }
        else
            return res.status(404).json({
                message: `${name} not found`
            });
    } catch (err) {
        return res.status(500).json({
            message: `Internal error`,
            error: err
        });
    }
});

//  Update new note
router.put('/:notename', async (req, res) => {
    try {
        const name = req.params.notename;
        const findNote = await notes.find({ name })
        return res.status(200).send(findNote);
    } catch (err) {
        return res.status(500).json({
            message: `Internal Error`,
            error: err
        });
    }
});


// Delete note
router.delete('/:noteId', async (req, res) => {
    try {
        const name = req.params.noteId;
        const findNote = await notes.find({ name });
        return res.status(200).send(findNote);
    } catch (err) {
        return res.status(500).json({
            message: `Internal Error`,
            error: err
        });
    }
});

module.exports = router;