const router = require('express').Router();
const chalk = require('chalk');
const bcrypt = require('bcrypt');
require('dotenv').config();

//Mongoose models
const items = require('../Models/items')

// Globals

//  Create new item -  needs note id, user credential
router.post('/');

//  Update new item - needs item id, user credential
router.put('/');

// read item - needs array of item ids
router.get('/');

//  Delete item - needs note id, user credential
router.delete('/');

module.exports = router;