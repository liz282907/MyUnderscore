const _ = {}

_.compose = (...fns) => {
    return (...args) => {
        var innerArgs = args;

        while (fns.length) {
            const fn = fns.pop();
            innerArgs = fn.apply(this, innerArgs);
        }
        return innerArgs;
    }
}


const _ = {}

_.compose = function (argument) {
    return function(...args) => {
        var innerArgs = args;

        while (fns.length) {
            const fn = fns.pop();
            innerArgs = fn.apply(this, innerArgs);
        }
        return innerArgs;
    }
}




/**
 * test 
 */