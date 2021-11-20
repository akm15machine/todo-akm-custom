//  Standard Modules
const router = require("express").Router();
const chalk = require('chalk');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Mongoose models
const users = require('../Models/users');

//Middlewares
const verifyToken = require("../Middlewares/verifyToken");

// Globals
const saltRounds = Number(process.env.SALTROUNDS);
const access_secret_key = String(process.env.ACCESS_TOKEN_SECRET);
const jwt_headers = {
    algorithm: "HS256",
    expiresIn: Number(process.env.EXPIRES_IN_DAYS) * 86400,
};

//routes

//  User registration using email, username, phone number
/**
 * @swagger
 * /users/register:
 *   post:
 *     description: This route is used to register user into the database
 *     responses:
 *       200:
 *         description: Shows user creation is successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                  type: string
 *                  example: Success!
 *                  description: Success!
 */
router.post('/register', async (req, res) => {
    try {
        const {name, email, phone} = req.body;
        //pass should be allowed to be modified by bcrypt
        let pass = req.body.pass;
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
router.post('/', async (req, res) =>{
    try{
        const { name, email, phone, pass} = req.body;

        // if anyone of name or email or phone is provided
        let findUser;
        if (name)
            findUser = await users.findOne({name});
        else if (email)
            findUser = await users.findOne({email});
        else if (phone)
            findUser = await users.findOne({phone});
        else {
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
                const accessToken = jwt.sign({ email: findUser.email, user_id: findUser._id },
                    access_secret_key,
                    jwt_headers
                );

                return res.status(200).json({
                    message: `User, ${name || email || phone} found, logging in!`,
                    token: accessToken
                });
            }
            else
                return res.status(401).json({
                    message: `Wrong password, keep trying ;)`
                });
        }
    } catch(err){
        return res.status(500).json({
            message: `Something went horribly wrong`,
            error: err
        });
    }
});


// Update profile - requires password
router.put('/');
// Reset Password - requires something TODO
router.post('/reset');

// logs user out
router.delete('/', verifyToken, )

// Delete User: Deletes user along with notes and items - requires password
router.delete('/delete')

module.exports = router;