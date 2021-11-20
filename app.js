//  Standard Modules
const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();


// App submodules
// Routes
const Users = require('./Routes/Users');
const Notes = require('./Routes/Notes');
const Items = require('./Routes/Items');


//  Globals
const app = express();
const port = Number(process.env.PORT || 3000);
const uri = process.env.MONGO_URI;

// Mongoose connection operation
mongoose
    .connect( uri, {
        useNewUrlParser: true
    })
    .then()
    .catch(err => {
        console.log(`Error: ${err}`);
        process.exit(1);
    });


/*======================All the call-backs========================*/
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '1mb', urlencoded: false, extended: true }));

// connection success callback
mongoose.connection.once('open', () => {    //TODO - does this needs to be in try-catch?
    console.log(chalk.cyan('Database Connection Successful'));
});

//Routes
app.get('/', (req, res) => {
    res.send(`Hello, this is AKM's To-Do App, hope to see some interactivity in the other routes!`);
});

// add swagger config.
const swaggerSpec = require('./config/swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users', Users);
app.use('/notes', Notes);
app.use('/items', Items);

//  Listener
app.listen(port, () => {
    console.log(chalk.blue(`[app.js] listening at http://localhost:${port}`));
});