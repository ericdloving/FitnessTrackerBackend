const express = require('express');
const server = express();


const cors = require('cors');
server.use(cors());

const morgan = require('morgan');
server.use(morgan('dev'));
const { PORT } = process.env;

server.use('/api', require('./api'));
// Setup your Middleware and API Router here
server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
  });

module.exports = server;
