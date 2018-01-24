const app = require('./index');
const request = require('supertest')(app.app);
require('should');

describe('GET /users', () => {
    describe('success', () => {
        it('Get user list', (done) => {
            request.get('/users')
                .end((err, res) => {
                    res.body.should.be.instanceOf(Array);
                    done(err);
                });
        });

        it('limit test', (done) => {
            request.get('/users?limit=2')
                .end((err, res) => {
                    res.body.should.have.lengthOf(2);
                    done(err);
                });
        });
    });
    describe('failure', () => {
        it('limit must be Number', (done) => {
            request.get('/users?limit=two')
                .expect(400)
                .end(done);
        });
    });
});
describe('GET /users/1', () => {
    describe('success', () => {
        it('user id should 1', (done) => {
            request.get('/users/1')
                .end((err, res) => {
                    res.body.should.have.property('id', 1);
                    done(err);
                });
        });
    });

    describe('fail', () => {
        it('user id should number', (done) => {
            request.get('/users/a')
                .expect(400)
                .end((err) => {
                    done(err);
                });
        });
        it('user not exists', (done) => {
            request.get('/users/4')
                .expect(404)
                .end((err) => {
                    done(err);
                });
        });
    });
});

describe('DELETE /users/1', () => {
    it('delete success', (done) => {
        request.delete('/users/1')
            .expect(204)
            .end(done);
    });
    it('should be deleted (cannot delete twice)', (done) => {
        request.delete('/users/1')
            .expect(404)
            .end(done);
    });
    it('should be deleted (user must be deleted)', (done) => {
        request.get('/users/1')
            .expect(404)
            .end(done);
    });
    it('expect 400', (done) => {
        request.delete('/users/a')
            .expect(400)
            .end(done);
    });
    it('expect 404', (done) => {
        request.delete('/users/4')
            .expect(404)
            .end(done);
    });
});

describe('POST /users', () => {
    it('creation test (status code 201 & return created user object)', (done) => {
        request.post('/users')
            .send({
                name: 'BJH'
            })
            .expect(201)
            .end((err, res) => {
                res.body.should.have.property('id');
                res.body.should.have.property('name', 'BJH');
                done(err);
            });
    });
    it('user should be created', done => {
        request.get('/users')
            .expect(200)
            .end((err, res) => {
                res.body.filter(x => x.name === 'BJH').length.should.equal(1);
                done(err);
            });
    });
    it('invalid param check (missing name prop)', (done) => {
        request.post('/users')
            .send({})
            .expect(400)
            .end(done);
    });
    it('invalid param check (empty name prop)', (done) => {
        request.post('/users')
            .send({})
            .expect(400)
            .end(done);
    });
    it('invalid param check (duplicated name)', (done) => {
        request.post('/users')
            .send({
                name: 'BJH'
            })
            .expect(400)
            .end(done);
    });
});
