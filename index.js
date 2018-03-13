require('ts-node/register');
const app = require('./src/app');

const http = require('http');

http.createServer(app)
    .listen({
        host: '127.0.0.1',
        port: 3000
    }, (err, result) => {
        if (err) {
            console.warn('err', err);
        } else {
            console.log('ok', result);
        }
    });
