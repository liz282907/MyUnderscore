const _ = {}

_.has = (obj, key) => {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 返回对象中的属于自身的可枚举属性。（因为for in就是所有可枚举的，只不过是深入原型链的）
 * 有原生的就调用原生的方法，对于obj为数组，返回indexArr.
 * 否则，遍历原型链上的key,找到那些obj独有的key。
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
_.keys = (obj)=>{
	if(!(typeof obj==='object')) return [];
	if(Object.keys) return Object.keys(obj);

	const keys = [];
	for(let key in obj) {
		//忽略掉原型链上的属性
		if(_.has(obj,key)) keys.push(key);
	}
	return keys;
}

_.values = (obj)=>{
	const keys = _.keys(obj),values = [];
    for (let i = 0; i < obj.length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
}

export default _;