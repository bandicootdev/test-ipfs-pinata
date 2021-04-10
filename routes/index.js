require('dotenv').config();
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage}).array('file', 20)
const app = express();
const {ipfs} = require('../utils/helpers');
let node;

ipfs.on('ipfs', (data) => {
    node = data;
})

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Repository for testing with ipfs',
        author: 'BandicootDev'
    })
})

app.get('/file', (req, res, next) => {

});

app.post('/file', [upload, async (req, res, next) => {
    await node.ready;
    let promises;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'Bad Request'
        })
    }

    const files = [...req.files]

    try {
        console.time('load result in ipfs');
        promises = await Promise.all(files.map((file) => {
            return node.add(file.buffer)
        }))
        console.timeEnd('load result in ipfs');
    } catch (err) {
        next(err)
    }
    console.log(promises)

    res.status(200).json({
        ok: true,
        message: 'files uploaded successfully'
    })
}]);


module.exports = app;