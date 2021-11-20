
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for Todo-AKM-custom',
        version: '1.0.0',
        description:
            'REST API for Todo-AKM-custom.',
        license: {
            name: 'GPL-3.0 Public License',
            url: 'https://github.com/akm15machine/todo-akm-custom',
        },
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT}`,
            description: 'Development Server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./Routes/Users.js'],    //referenced from app.js
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;