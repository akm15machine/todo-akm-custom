//  Standard Modules
const express = require('express');
require('dotenv').config();

// App submodules
const consoleStyles = require('./termStyle');


//  Globals
const app = express()
const port = process.env.PORT || 3000;

//  All the call-backs
app.get('/', (req, res) => {
    res.send(`Hello, this is AKM's To-Do App, hope to see some interactivity in the other routes!`)
});

//  Listener
app.listen(port, () => {
    console.log(consoleStyles.FgBlue, `[app.js] listening at http://localhost:${port}`);
    console.log(consoleStyles.Reset); //reset colors
});