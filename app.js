const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middleware/error_handler');
if (dotenv.error) {
    console.log('An error has occurred in:');
    console.log('=========================');
    console.log(dotenv.error)
}
const app = express();

app.use(cors())
app.use(morgan(process.env.NODE_ENV || 'dev'));
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(routes);
app.use(errorHandler);

module.exports = app;