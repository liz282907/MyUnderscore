import { isFunction, isTypeof } from './util.js'

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
    return function func(...args) {
        if (count > 0) {
            count--;
            result = fn.apply(this, args);
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
_.partial = (fn, ...args) => {
    return function(...leftArgs) {
        let fillCount = 0;
        for (let i = 0; i < args.length; i++) {
            if (args[i] === _) args[i] = leftArgs[fillCount++];
        }
        const totalArgs = args.concat(leftArgs.slice(fillCount));
        return fn.apply(this, totalArgs)
    }
}

_.once = (fn) => {
    return _.before(1, fn)
}

/**
 * 将第一个函数 function 封装到函数 wrapper 里面, 
 * 并把函数 function 作为第一个参数传给 wrapper. 
 * 这样可以让 wrapper 在 function 运行之前和之后 执行代码, 
 * 调整参数然后附有条件地执行.
 * 本来return (...args)=>{
 *      const _args = [fn,...args];
        return wrapper.apply(this,_args);
    }
    但实际上应该更有扩展性一点,可以复用partial的代码，即把fn作为参数缓存
 * @param  {Function} fn      [description]
 * @param  {[type]}   wrapper [description]
 * @return {[type]}           [description]
 */
_.wrap = (fn, wrapper) => {
    return _.partial(wrapper, fn)
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
_.memoize = (function() {
    let hashFunction = (...args) => args[0]; //2
    return (fn, hasher = hashFunction) => {
        const cache = {};
        const memoize = (...args) => {
            const customKey = hasher.apply(this, args);
            return cache[customKey] || (cache[customKey] = fn.apply(this, args))
        }
        memoize.cache = cache;
        return memoize;
    }
})()

/**
 * 注意这边prototype的挂载，因为fn = parent.bind以后,fn有可能是作为构造函数存在的，那么如果不挂载的话，
 * var fnObj = new fn(). (在new运算符中，把fn的原型绑给了返回的对象)，因此fnObj._proto_ === fn.prototype 
 * 而fn.prototype == obj,即之前绑定的对象。实际上是不应该这样的。
 * 我们看下原生的bind，会发现fn的原型应该挂到绑定的函数上面。因此需要修正。具体我们可以做个测试。
 * ![](http://i2.muimg.com/588926/875cead4bbc32b65.png)。
 * 也就是说，对于通常的当做函数使用来说，返回的函数的this应该挂在指定的obj上，而作为构造函数调用的话，生成的对象的this的原型链上应该是本函数->绑定的函数，
 * 而非本函数->绑定的对象
 * @param  {Function}  fn   [description]
 * @param  {[type]}    obj  [description]
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
_.bind = function(fn, obj, ...args) {
    const nativeBind = Function.prototype.bind;

    if (nativeBind && fn.bind === nativeBind) return nativeBind.apply(fn, [obj].concat(args)); //注意这边是整体的参数数组
    if (!isFunction(fn)) throw new TypeError('Bind must be called on a function');
    const boundFunc = function(...leftArgs) {
        let _args = args.concat(leftArgs);
        //作为构造函数时，this指向new的对象，因为下面绑定了原函数，所以true.
        //作为普通函数时，this指向window,
        if (!(this instanceof boundFunc)) return fn.apply(obj, _args); //硬绑定> 显示调用
        //针对new 的处理。仔细看下underscore源码我们会发现，其实它是把new操作符又重新实现了一遍。其实假定new有效的话，只要按照下面绑定原型到fn上即可。
        boundFunc.prototype = Object.create(fn.prototype);
        // return fn.apply(this,_args);

        //new返回的this优先级大于指定的context(obj).
        // const FNop = function() {}
        // if (fn.prototype) FNop.prototype = Object.create(fn.prototype);
        // const newObj = new FNop();
        // FNop.prototype = null;
        // const result = fn.apply(newObj, _args);
        // return typeof result === 'object' ? result : newObj;
    }
    

    return boundFunc;
}

/**
 * 把methodNames参数指定的一些方法绑定到object上，
 * 这些方法就会在对象的上下文环境中执行。绑定函数用作事件处理函数时非常便利，
 * 否则函数被调用时this一点用也没有。methodNames参数是必须的。
 * @param  {Function}  fn   [description]
 * @param  {[type]}    obj  [description]
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
_.bindAll = (obj, ...methodNames) => {
    methodNames.forEach((name) => {
        let fn;
        if (fn = obj[name]) {
            obj[name] = _.bind(fn, obj);
        }
    })
    return obj;
}

/**
 * 如果context被指定（非null,undefined, iteratee将被绑到上面，否则指向全局的this（严格环境下就是undefined））
 * @param  {[type]}    list     [description]
 * @param  {[type]}    iteratee [description]
 * @param  {...[type]} args     [description]
 * @return {[type]}             [description]
 */
_.map = (list, iteratee, context = this) => {
    const result = [];
    const keys = isTypeof('object')(list) && Object.keys(list),
        len = (keys || list).length; //在调用iteratee的过程中，可能改变list，但是传来的值是访问到它的时候，增加的不会访问到。因此缓存length就可以
    for (let i = 0; i < len; i++) {
        const key = keys ? keys[i] : i;
        result.push(iteratee.call(context, list[key], key, list)); //不要call跟apply总忘记
    }
    return result;
}

_.reduce = (list, iteratee, ...args) => {
    let memo = args[0] || list[0];
    const keys = isTypeof('object')(list) && Object.keys(list);
    const context = args[1] || this,
        len = (keys || list).length,
        start = args[0] ? 0 : 1;

    if (len<1 && !memo) throw new TypeError('memo must be provided when list is empty');

    for (let i = start; i < len; i++) {
        const key = keys ? keys[i] : i;
        memo = iteratee.call(context, memo, list[key], key, list);
    }
    return memo;
}

_.templateSetting = {
    interpolate: /<%=([\s\S]+)%>/g,
    evaluate    : /<%([\s\S]+?)%>/g
}



/**
 * 示例： ![](http://i4.buimg.com/519918/b5cd680d9364ae1b.png)
 * 注意点，
 * 1，因为replace g是多次执行的，因此post应该在最后再处理，中间的inner会一直计算。
 * 2，reg的建立是有顺序的， 不能像楼主一样，最开始直接用keys.join(),因为object.keys里面的顺序不定。导致matched,跟execution
 * 可能不是预期的顺序。不好处理到底是值还是运算表达式。
 * 常数部分直接取出来，别忘了左右加个''，即 `'${常量string}'`,这样放到function里面的就真的是string,而不是被解析为变量
 * @param  {[type]} tplStr   [description]
 * @param  {[type]} settings [description]
 * @return {[type]}          [description]
 */
_.template = (tplStr,settings)=>{

    const setting = settings || _.templateSetting;
    // const re = Object.keys(setting).map(category=>setting[category].source).join('|')
    const re = [setting.interpolate.source,setting.evaluate.source].join('|')
    const matcher = new RegExp(re,'g');

    let index = 0,content = '',fn;
    //回调函数可能会执行多次
    tplStr.replace(matcher,(matchReg,matched,excution,offset,primitive)=>{
        let prev = primitive.slice(index,offset),inner = '';
        content += `'${prev}'`

        index += offset+matchReg.length;
        if(excution){
            inner = `;\n${excution} \n content+=`;
        }else{
            inner = `+${matched}+`
        }
        content += `${inner}`;
        
    })
    const post = tplStr.slice(index);
    content += `'${post}'`
    const fnFactory = `
            let content = '';
            with(obj){
                content += ${content}
            }
            return content;
            `
    fn = new Function('obj',fnFactory);

    //fn只在最开始的时候进行编译，以后就不用再处理了
    return (obj)=>{
        return fn.call(this,obj); 
    }
}

export default _;
