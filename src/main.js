const _ = {}

_.compose = (...fns) => {
    return (...args) => {
        var innerArgs = args;

        while (fns.length) {
            const fn = fns.pop();
            innerArgs = fn.apply(this, innerArgs);
            innerArgs = [].concat(innerArgs);
        }
        return innerArgs;
    }
}
_.after = (count, fn) => {
    let _count = 0;
    return (...args) => {
        _count++;
        if (_count === count) return fn.apply(this, args);
    }
}

_.before = (count, fn) => {
	let result;
    return function func(...args){
    	if(count>0) {
    		count--;
        	result =  fn.apply(this,args);
    	}
        
        return result;
    }
}

/**
 * Partially apply a function by creating a version that has had some 
 * of its arguments pre-filled, without changing its dynamic this context. 
 * _ acts as a placeholder, allowing any combination of arguments to be 
 * pre-filled.
 * @param  {Function}  fn   [description]
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
_.partial = (fn,...args)=>{
	return function(...leftArgs){
		let fillCount = 0;
		for(let i=0;i<args.length;i++){
			if(args[i]===_) args[i] = leftArgs[fillCount++];
		}
		const totalArgs = args.concat(leftArgs.slice(fillCount));
		return fn.apply(this,totalArgs)
	}
}

_.once = (fn)=>{
	return _.before(1,fn)
}

/**
 * 将第一个函数 function 封装到函数 wrapper 里面, 
 * 并把函数 function 作为第一个参数传给 wrapper. 
 * 这样可以让 wrapper 在 function 运行之前和之后 执行代码, 
 * 调整参数然后附有条件地执行.
 * 本来return (...args)=>{
 * 		const _args = [fn,...args];
		return wrapper.apply(this,_args);
	}
	但实际上应该更有扩展性一点,可以复用partial的代码，即把fn作为参数缓存
 * @param  {Function} fn      [description]
 * @param  {[type]}   wrapper [description]
 * @return {[type]}           [description]
 */
_.wrap = (fn,wrapper)=>{
	return _.partial(wrapper,fn)
}

/**
 * Memoizes方法可以缓存某函数的计算结果。返回一个函数fn(key)，持有cache属性（obj）,里面存放key: fn(key)的函数历史结果
 * memoize的第二个参数是可选参数，用于计算cache里面的key,如果未传递，则默认使用key,即fn的第一个参数。
 * 测试时，需要注意缓存结果跟计算结果要严格等于返回函数的cache属性。
 * 除此之外，cache应该对每一个返回的fn独有，而不应该在2处。
 * @param  {[type]} function       [description]
 * @param  {[type]} [hashFunction] [description]
 * @return {[type]}                [description]
 */
_.memoize = (function(){
	let hashFunction = (...args)=>args[0];  //2
	return (fn,hasher = hashFunction)=>{
		const cache = {};
		const memoize = (...args)=>{
			const customKey = hasher.apply(this,args);
			return cache[customKey] || (cache[customKey] = fn.apply(this,args))
		}
		memoize.cache = cache;
		return memoize;
	}
})()


export default _;
