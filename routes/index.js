require('dotenv').config();
const express = require('express');
const multer = require('multer');
const {pinata} = require("../config/ipfs");
const {clientIPFS} = require("../config/ipfs");
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

app.get('/file', async (req, res, next) => {
    const {cid} = req.query;
    await node.ready;
    const chunks = []

    for await (const chunk of node.cat(cid)) {
        chunks.push(chunk)
    }
    res.send(chunks)
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
            return node.add({
                path: file.filename,
                content: file.buffer
            })
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

app.get('/file-client', async (req, res, next) => {
    const {cid} = req.query;
    const chunks = [];
    try {
        for await (const chunk of clientIPFS().cat(cid)) {
            chunks.push(chunk)
        }
    } catch (err) {
        next(err)
    }

    res.send(chunks)
})

app.post('/file-client', [upload, async (req, res, next) => {
    let cid;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'Bad Request'
        })
    }
    try {
        console.time('load result in ipfs');
        cid = await clientIPFS().add({
            path: req.files[0].filename,
            content: req.files[0].buffer
        })
        console.timeEnd('load result in ipfs');
    } catch (err) {
        next(err)
    }

    res.status(200).json({
        ok: true,
        message: 'files uploaded successfully',
        cid
    })
}])

app.get('/file-pinata', async (req, res, next) => {
    let file;
    const hash = [
        'QmXhBgTs98r11qZmr83uHDjLXWwzU9xgvdowSvviDxtmaP'
    ]

    try {
        file = await pinata().pinByHash(hash[0]).catch((err) => {
            throw err
        });
    } catch (err) {
        next(err)
    }

    return res.status(200).json({
        ok: true,
        file
    })
})



module.exports = app;