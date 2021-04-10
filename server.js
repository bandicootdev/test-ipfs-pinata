const app = require('./app');
const {startIPFS} = require("./config/ipfs");
const {ipfs} = require('./utils/helpers');

const init = () => {
    startIPFS().then((node) => {
        ipfs.emit('ipfs', node);
        console.log(`server on port ${process.env.PORT || 3000}`);
    }).catch((err) => {
        console.log(err)
    })
}
app.listen(process.env.PORT || 3000, () => {
    init();
});