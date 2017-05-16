import chai from 'chai'
const assert = chai.assert;
import _ from '../src/main.js'
import { isTypeof, asyncFunction } from './helper/util'

describe('underscore/Function tests: ', function() {
    describe('1. _.componse 函数：', function() {
        const exclaim = statement => statement.toUpperCase() + "!";

        it('should return a function ', function() {
            const componsedFun = _.compose(new Function, new Function);
            assert.equal(true, isTypeof('Function')(componsedFun))
        })
        it('should passing returned value to next functions', function() {

            const greet = name => {
                assert.equal(name, 'MOE!')
            }
        })
        it('should chain functions and passing values to finally get the result', function() {

            const greet = name => 'hi ' + name;
            const welcome = _.compose(greet, exclaim);

            assert.equal('hi MOE!', welcome('moe'))
        })
    })

    describe('2. _.after 函数：', function() {
        const notes = [1, 2, 3];

        it('should be excuted until all have excuted ', function(done) {
            let count = 0;
            const render = () => {
                // console.log('---done!---')
                assert.equal(count, notes.length);
                done();
            }
            const renderNotes = _.after(notes.length, render);
            notes.forEach((note) => {
                const fn = ((note) => {
                    count++;
                    // console.log('  note  ',note);
                    renderNotes();
                }).bind(this, note);
                asyncFunction(fn)
            });
        })
    })

    describe('3. _.before 函数：', function() {
        const notes = [1, 2, 3],
            count = 6;

        it('should return the same result after count', function() {
            let initial = 1000,
                step = 100;
            const askForRaise = (function(initial, step) {
                let salary = initial;
                return () => {
                    salary += step;
                    return salary;
                };
            })(initial, step);
            const raiseSalaryBy100 = _.before(count, askForRaise);

            const randomExcutedCount = count + Math.floor(Math.random() * 100),
                finalSalary = initial + step * count;
            const result = Array.from(new Array(randomExcutedCount).keys()).every(function(index) {
                const curSalary = raiseSalaryBy100();
                if (index + 1 >= count) return finalSalary === curSalary;
                return curSalary === initial + step * (index + 1);
            })

            assert.equal(result, true)
        })
    })

    describe('4. _.partial 函数：', function() {

        it('should pre-fill partial args and get final value', function() {
            const add = (a, b) => a + b;
            const add5 = _.partial(add, 5);
            assert.equal(15, add5(10));
        })
        it('should remain un-filled when passing _ to the args', function() {
            const selectMin = (...args) => Math.min.apply(null, args)
            const selectMinArgs = _.partial(selectMin, _, 4, 5);
            assert.equal(4, selectMinArgs(10));
        })
        it('accepts more arguments than the number of placeholders', function() {
            const func = _.partial(function() {
                return arguments.length
            }, _, 'b', _, 'd');
            assert.equal(5, func('a', 'c', 'e'));
        })
        it('cound remain arg length when some of the placeholders aren\'t fullfilled when calling', function() {
            const func = _.partial(function() {
                return arguments.length
            }, _, 'b', _, 'd');
            assert.equal(4, func('a'));
        })
        it('unfilled placeholders are undefined', function() {
            const func = _.partial(function() {
                return arguments[2]
            }, _, 'b', _, 'd');
            assert.equal(undefined, func('a'));
        })
    })

    describe('5. _wrap函数 ', function() {
        it('should wrap the given salutation function', function() {
            let hello = name=> 'hello: ' + name;
            hello = _.wrap(hello, function(func) {
                return "before, " + func("moe") + ", after";
            });
            assert.equal(hello(),'before, hello: moe, after')
        })

        it('should hold fn as the first parameter of the wrapper', function() {
            let hello = name=> 'hello: ' + name;
            let wrappedHello = _.wrap(hello, function(func) {
                assert.equal(hello,func)
                return "before, " + func("moe") + ", after";;
            });
            wrappedHello()
        })
    })
    describe('6. _memoize函数 ', function() {
        const fib = n=> n < 2 ? n : fib(n - 1) + fib(n - 2);

        it('should memoize the value of a fibonacci result and equal to it', function() {
            const memoFib = _.memoize(fib);
            assert.equal(fib(10),55)
            assert.equal(memoFib(10),55)
        })

        it('should memoize all the result of the function', function() {
            const  upper = _.memoize(s=>s.toUpperCase());
            assert.strictEqual(upper('foo'),'FOO');
            assert.strictEqual(upper('bar'),'BAR');
            assert.deepEqual(upper.cache,{'foo':'FOO','bar':'BAR'},'cache return all the cached value')
            assert.property(upper,'cache')
        })


        it('should store the hashed key as the cache key', function() {
            var objCacher = _.memoize((value, key) =>({key: key, value: value}), 
                                        (value, key) => key);
            var myObj = objCacher('a', 'alpha');
            var myObjAlias = objCacher('b', 'alpha');
            assert.notStrictEqual(myObj, void 0, 'object is created if second argument used as key');
            assert.strictEqual(myObj, myObjAlias, 'object is cached if second argument used as key');
            assert.strictEqual(myObj.value, 'a', 'object is not modified if second argument used as key')
        })
    })
})
