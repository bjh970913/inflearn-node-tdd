import {expect} from 'chai';
import {A} from './test'

suite('test Function A', () => {
    test('1 +1 should be 1', () => {
        expect(A(1, 2)).to.equal(3);
    })
});
