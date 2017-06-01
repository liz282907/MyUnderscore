1. 局部变量使用
高性能JavaScript里面，局部变量要比a.b.c要高效，因为要一层层的去查找原型链，而且越深，耗时越多
>一般来说，如果在同一个函数中你要多次读取同一个对象属性，最好将它存入一个局部变量。以局部变 量替代属性，避免多余的属性查找带来性能开销。

2. bind示例
```
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
        return fn.apply(this,_args);//这一行可以不用加的，因为new操作符里面都做了。

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

var foo = {
    value: 1
};
 
function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);
 
}
 
var bindFoo = _.bind(bar,foo, 'daisy');
bindFoo('18');

console.log('---------------')

var value = 2;
 
var foo = {
    value: 1
};
 
function baz(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}
 
baz.prototype.friend = 'kevin';
 
var bindFoo = _.bind(baz,foo, 'daisy');
 
var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
```


3. _.template示例_
![](http://i4.buimg.com/519918/b5cd680d9364ae1b.png)
一定要注意