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

export default _;
