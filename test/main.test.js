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
        	const render = ()=> {
            	// console.log('---done!---')
            	assert.equal(count,notes.length);
            	done();
            }
            const renderNotes = _.after(notes.length, render);
            notes.forEach((note)=>{
            	const fn = ((note)=> {
            		count++;
            		// console.log('  note  ',note);
            		renderNotes();
            	}).bind(this,note);
            	asyncFunction(fn)
            });  
        })
    })

    describe('3. _.before 函数：', function() {
        const notes = [1, 2, 3],count = 6;
        
        it('should return the same result after count', function() {
        	let initial = 1000,step = 100;
        	const askForRaise = (function(initial,step){
        		let salary = initial;
        		return ()=> {
        			salary += step;
        			return salary;
        		};
        	})(initial,step);
        	const raiseSalaryBy100 = _.before(count,askForRaise);

        	const randomExcutedCount = count + Math.floor(Math.random()* 100),
        		finalSalary = initial + step * count;
        	const result = Array.from(new Array(randomExcutedCount).keys()).every(function(index){
        		const curSalary = raiseSalaryBy100();
        		if(index+1>=count) return finalSalary === curSalary;
        		return curSalary === initial + step * (index+1);
        	})

        	assert.equal(result,true)
        })
    })
})
