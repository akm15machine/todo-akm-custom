const router = require('express').Router();
const chalk = require('chalk');
const bcrypt = require('bcrypt');
require('dotenv').config();

//Mongoose models
const items = require('../Models/items')

// Globals

//  Create new item
router.post('/');

//  Update new item
router.put('/');

// read item
router.get('/');

//  Delete item
router.delete('/');

module.exports = router;