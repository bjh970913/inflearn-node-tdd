const app = require('./index');
const request = require('supertest');
// const mocha = require('mocha');
// const should = require('should');

describe('GET /users', () => {
    describe('success', () => {
        it('Get user list', (done) => {
            request(app.app)
                .get('/users')
                .end((err, res) => {
                    if (err) throw err;
                    res.body.should.be.instanceOf(Array);
                    done();
                });
        });
    });
});
