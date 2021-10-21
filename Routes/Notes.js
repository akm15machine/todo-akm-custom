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
    try{
        const {name, itemMsgs, user} = req.body;
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
        const userLoggedIn = (user.name === "AKM"); //JWT to be implemented
        if (userLoggedIn)
        {
            const newNote = new notes({name});
            const itemIds = []
            
            // for each item supplied
            itemMsgs.forEach(async item => {
                const newItem = new items();
                //store the ids, later required for mapping
                itemIds.push(newItem._id);
                newItem.message = item.message;
                newItem.noteId = newNote._id;
                //color
                newItem.color.R = item.color.R||newItem.color.R;
                newItem.color.G = item.color.G||newItem.color.G;
                newItem.color.B = item.color.B||newItem.color.B;
                
                await newItem.save().catch(err =>{
                    return res.status(500).json({
                        message: `Database error, couldn't add item`
                    });
                });
            });
            
            newNote.item_ids = itemIds;
            await newNote.save().catch(err => {
                return res.status(500).json({
                    message: `Database error, couldn't save note!`
                });
            });
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

//  Update new note
router.put('/:notename', async (req, res) => {
    const name = req.params.notename;
    const findNote = await notes.find({name})
    res.status(200).send(findNote);
});

// Read note
// responds with all the items
router.get('/:notename', async (req, res) => {
    try {
        const name = req.params.notename;
        const findNote = await notes.find({name});
        if (findNote){
            const _id = [];
            await findNote.forEach(note_elem => {
                _id.push(...note_elem.item_ids);
            });
            const findItems = await items.find({_id});
            res.status(200).json(findItems);
        }
        else
            return res.status(404).json({
                message: `${name} not found`
            });
    } catch(err) {
        return res.status(500).json({
            message: `Internal error`,
            error: err
        });
    }
});

// Delete note
router.delete('/');

module.exports = router;