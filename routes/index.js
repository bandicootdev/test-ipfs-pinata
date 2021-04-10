const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message:'Repository for testing with ipfs',
        author: 'BandicootDev'
    })
})

app.get('/file', (req, res, next) => {

});

app.post('/file', (req, res, next) => {

});

module.exports = app;