import {app} from './app';
import * as supertest from 'supertest';
import {expect} from 'chai';

async function initApp(): Promise<supertest.SuperTest<supertest.Test>> {
    const request = supertest(app);

    await new Promise(resolve => {
        request.post('/users')
            .send({
                name: 'zero'
            })
            .end(resolve)
    });
    await new Promise(resolve => {
        request.post('/users')
            .send({
                name: 'alice'
            })
            .end(resolve)
    });
    await new Promise(resolve => {
        request.post('/users')
            .send({
                name: 'bek'
            })
            .end(resolve)
    });
    await new Promise(resolve => {
        request.post('/users')
            .send({
                name: 'bek'
            })
            .end(resolve)
    });

    return request;
}

suite('App module', () => {
    let request: supertest.SuperTest<supertest.Test>;
    //
    setup((done) => {
        initApp()
            .then(r => request = r)
            .then(() => done());
    });
    //
    // beforeEach((done) => {
    //     initApp()
    //         .then(r => request = r)
    //         .then(() => done());
    // });

    suite('GET /users', () => {
        test('success', (done) => {
            request.get('/users')
                .end((err, res) => {
                    expect(res.body).to.be.a.instanceof(Array);
                    done(err);
                });
        });

        test('limit test', (done) => {
            request.get('/users?limit=2')
                .end((err, res) => {
                    expect(res.body).to.be.lengthOf(2);
                    done(err);
                });
        });

        test('limit must be Number', (done) => {
            request.get('/users?limit=two')
                .expect(400)
                .end(done);
        });
    });

    suite('GET /users/1', () => {
        suite('success', () => {
            test('user id should 1', (done) => {
                request.get('/users/1')
                    .end((err, res) => {
                        console.log(res);
                        expect(res.body).to.haveOwnPropertyDescriptor('id', {
                            value: 1
                        });
                        done(err);
                    });
            });
        });

        suite('fail', () => {
            test('user id should number', (done) => {
                request.get('/users/a')
                    .expect(400)
                    .end((err) => {
                        done(err);
                    });
            });
            test('user not exists', (done) => {
                request.get('/users/4')
                    .expect(404)
                    .end((err) => {
                        done(err);
                    });
            });
        });
    });


    suite('DELETE /users/1', () => {
        test('delete success', (done) => {
            request.delete('/users/1')
                .expect(204)
                .end(done);
        });
        test('should be deleted (cannot delete twice)', (done) => {
            request.delete('/users/1')
                .expect(404)
                .end(done);
        });
        test('should be deleted (user must be deleted)', (done) => {
            request.get('/users/1')
                .expect(404)
                .end(done);
        });
        test('expect 400', (done) => {
            request.delete('/users/a')
                .expect(400)
                .end(done);
        });
        test('expect 404', (done) => {
            request.delete('/users/4')
                .expect(404)
                .end(done);
        });
    });

    suite('POST /users', () => {
        test('creation test (status code 201 & return created user object)', (done) => {
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
        test('user should be created', done => {
            request.get('/users')
                .expect(200)
                .end((err, res) => {
                    res.body.filter(x => x.name === 'BJH').length.should.equal(1);
                    done(err);
                });
        });
        test('invalid param check (missing name prop)', (done) => {
            request.post('/users')
                .send({})
                .expect(400)
                .end(done);
        });
        test('invalid param check (empty name prop)', (done) => {
            request.post('/users')
                .send({})
                .expect(400)
                .end(done);
        });
        test('invalid param check (duplicated name)', (done) => {
            request.post('/users')
                .send({
                    name: 'BJH'
                })
                .expect(400)
                .end(done);
        });
    });


    suite('PUT /users/:id', () => {
        suite('SUCCESS', () => {
            test('return updated user', (done) => {
                const newName = 'den';

                request.put('/users/3')
                    .send({name: newName})
                    .end((err, res) => {
                        res.body.should.have.property('name', newName);
                        done();
                    })
            })
        });

        suite('ERROR', () => {
            test('400 on non number id', (done) => {
                request.put('/users/a')
                    .send({name: 'AAA'})
                    .expect(400)
                    .end(done);
            });

            test('400 on name not sent', (done) => {
                request.put('/users/a')
                    .expect(400)
                    .end(done);
            });

            test('404 non exists user', (done) => {
                request.put('/users/900')
                    .send({name: 'AAA'})
                    .expect(404)
                    .end(done);
            });

            test('409 on name duplicated', (done) => {
                request.put('/users/2')
                    .send({name: 'den'})
                    .expect(409)
                    .end(done);
            })
        })
    });
});


/*

*/
