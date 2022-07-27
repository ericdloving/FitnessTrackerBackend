const express = require('express');
const app = express();
app.use(express.json());



const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
app.use(morgan('dev'));

app.use('/api', require('./api'));
// Setup your Middleware and API Router here

function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action",
      });
    }
  
    next();
  }

module.exports = app,{requireUser};
