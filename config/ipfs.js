const IPFS = require('ipfs');
const ipfsClient = require('ipfs-http-client');
const pinataSDK = require('@pinata/sdk');

let ipfs = null;

module.exports.startIPFS = async () => {
    if (ipfs) {
        console.log('IPFS already started')
    } else if (ipfs && ipfs.enable) {
        ipfs = await ipfs.enable({commands: ['id']});
        process.env.IPFS_NODE = ipfs;
    } else {
        try {
            let label = `IPFS Started ${Math.random()}`
            console.time(label);
            ipfs = await IPFS.create({
                EXPERIMENTAL: {
                    pubsub: true,
                },
                init: {allowNew: false}
            })
            process.env.IPFS_NODE = ipfs;
            console.timeEnd(label);
        } catch (err) {
            do {
                await this.startIPFS();
            } while (err.code === 'ERR_LOCK_EXISTS' && ipfs === null);
        }
    }
    return ipfs;
}

module.exports.clientIPFS = () => ipfsClient({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
    // headers: {
    //     authorization: 'Bearer ' + TOKEN
    // }
})


module.exports.pinata = () => pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRECT);