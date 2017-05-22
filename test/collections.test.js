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

describe('underscore/Function tests: ', function() {


    describe('2. _.each 函数：', function() {
        const notes = [1, 2, 3];

        it('each iterators provide value and iteration count', function() {

            _.each([1, 2, 3], (num, i) => {
                assert.strictEqual(num, i + 1,'each iterators provide value and iteration count');
            })

            // const answers = [];
            // _.each([1, 2, 3], function(num) { answers.push(num); });
            // assert.deepEqual(answers, [1, 2, 3], 'can iterate a simple array');

            // let count = 0;
            // const obj = { 1: 'foo', 2: 'bar', 3: 'baz' };
            // _.each(obj, function() { count++; console.log(count)});
            // assert.strictEqual(3, count, 'the fun should be called only 3 times');
        })

        it('cound access the original list',function(){
            var answer = null;
            _.each([1, 2, 3], function(num, index, arr) {
                if (arr.includes(num)) answer = true;
            });
            assert.ok(answer, 'can reference the original collection from inside the iterator');
        })

        describe('cound only iterate the owned key-value of the list, ignore those in the prototype', function() {
            const answers = [],
                  obj = { one: 1, two: 2, three: 3 };

            before(() => {
                obj.constructor.prototype.four = 4;
            })
            it('cound only iterate the owned key-value of the list, ignore those in the prototype', function() {
                _.each(obj, function(value, key) { answers.push(key); });
                assert.deepEqual(answers, ['one', 'two', 'three'], 'iterating over objects works, and ignores the object prototype.');

            })
            after(() => {
                delete obj.constructor.prototype.four;
            })
        })

        it('cound access the context obj', function() {

            var answers = [];
            _.each([1, 2, 3], function(num) { answers.push(num * this.multiplier); }, { multiplier: 5 });
            assert.deepEqual(answers, [5, 10, 15], 'context object property accessed');

            // ensure the each function is JITed
            // _(1000).times(function() { _.each([], function() {}); });

        })

        it('cound handle other types of list,such as false,null', function() {
            
            let answers = 0;
            _.each(null, function() {++answers; });
            assert.strictEqual(answers, 0, 'handles a null properly');

            _.each(false, function() {});


            var a = [1, 2, 3];
            assert.strictEqual(_.each(a, function() {}), a);
            assert.strictEqual(_.each(null, function() {}), null);

            a = 'test';
            _.each(a, function(v,i) {assert.strictEqual(v,a[i])});

        })
    })


})
