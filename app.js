const express = require('express');
const app = express();


const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
app.use(morgan('dev'));

app.use('/api', require('./api'));
// Setup your Middleware and API Router here


module.exports = app;
