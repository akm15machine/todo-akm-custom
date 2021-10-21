//  Standard Modules
const router = require("express").Router();
const chalk = require('chalk');
const bcrypt = require('bcrypt');
require('dotenv').config();

//Mongoose models
const users = require('../Models/users')

// Globals
const saltRounds = Number(process.env.SALTROUNDS);

router.get('/', async (req, res) => {
    try{
        const { name, email } = req.body;   //as JSON
            console.log(name, email);
        res.status(200).send("Success!");
    } catch (err) {
        console.log(chalk.red(`message: ${err}`));
        res.status(500).send(`Internal error: ${err}`);
    } finally {
        //debug lines
        //console.log({requestBody: req.body});
    }
});

//  User registration using email, username, phone number
router.post('/register', async (req, res) => {
    try {
        const {name, email, phone} = req.body;
        //pass should be allowed to be modified by bcrypt
        var pass = req.body.pass;
        // checking if proper details are provided
        if (!name || !email || !pass || !phone){
            res.status(401).json({message: `Please send the necessary details`});
            return;
        }
        // check if user with same email already exists in DB
        const findUser = await users.findOne({email:email});
        if (findUser) {
            res.status(400).json({message: `User with ${email} already exists, try /users/login !`});
            return;
        }     
        //bcrypting password
        pass = await bcrypt.hash(pass, saltRounds);
        
        // create new user using schema
        const newUser = new users({ name, email, pass, phone });

        // create user in database, save new user
        const createUser = await newUser.save().catch(err => {
            return res.status(500).json({message: "Database Error: User Creation Failed", error: err});
        });

        if (!createUser){
            return res.status(500).json({
                message: `User creation failed`
            });
        }
        res.status(200).json({ message: `Success!`});
    } catch (err) {
        res.status(500).json({
            message: `Ultimate server error`
        });
    }
});

// User login using name, email or phone number
router.get('/login', async (req, res) =>{
    try{
        const {name, email, phone, pass} = req.body;
        // if anyone of name or email or phone is provided
        var findUser;
        if (name)
            findUser = await users.findOne({name});
        else if (email)
            findUser = await users.findOne({email});
        else if (phone)
            findUser = await users.findOne({phone});
        else{
            return res.status(401).json({
                message: `Please enter your username or email or phone no.`
            });
        }
        if (!findUser){
            return res.status(404).json({
                message: `User ${name || email || phone} not found, try /users/register !`
            });
        }
        else {
            //if the code made it's way till here, means findUser is here
            if (await bcrypt.compare(pass, findUser.pass)) {
                return res.status(200).json({
                    message: `User, ${name || email || phone} found, logging in!`
                });
            }
            else
                return res.status(401).json({
                    message: `Wrong password, keep trying ;)`
                });
        }
    } catch(err){
        return res.status(500).json({
            message: `Something wen't horribly wrong`,
            error: err
        });
    }
});


module.exports = router;