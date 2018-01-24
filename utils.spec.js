const utils = require('./utils');
// const assert = require('assert');
// const should = require('should');

describe('utils', () => {
    it('replace first char to uppercase', () => {
        const result = utils.capitalize('hello');
        // assert.equal(result, 'Hello');
        result.should.be.equal('Hello');
    });
});
