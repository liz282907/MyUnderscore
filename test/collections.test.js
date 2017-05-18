import chai from 'chai'
const assert = chai.assert;
import _ from '../src/Collection.js'

describe('underscore/Function tests: ', function() {


    describe('1. _.shuffle 函数：', function() {
        const notes = [1, 2, 3];

        it('should shuffle an obj or an array with equal possibilities ', function() {

            assert.deepEqual(_.shuffle([1]), [1], 'behaves correctly on size 1 arrays');
            var numbers = _.range(20);
            var shuffled = _.shuffle(numbers);
            assert.notDeepEqual(numbers, shuffled, 'does change the order'); // Chance of false negative: 1 in ~2.4*10^18
            assert.notStrictEqual(numbers, shuffled, 'original object is unmodified');
            // assert.deepEqual(numbers, shuffled, 'contains the same members before and after shuffle');

            shuffled = _.shuffle({ a: 1, b: 2, c: 3, d: 4 });
            assert.strictEqual(shuffled.length, 4);
            assert.deepEqual(shuffled.sort(), [1, 2, 3, 4], 'works on objects');
        })
    })


})
