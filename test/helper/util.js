export const isTypeof = (type)=>{
	return (obj)=>{
		const types = type.split("||");
		return types.some(type=>{
			const reg = new RegExp(`function\\s+(${type}).*`)
			let objType;
			if(obj===null) objType = 'null'
			else if(typeof(obj)==='undefined') objType = 'undefined'
			else{
				if(type==='Function') return typeof(obj)==='function'
				if(type==='Object') return typeof(obj)==='object'

				if(obj.constructor===undefined) return false; //x由Object.create(null),且要检验是否为自定义类型
				const matchArr = obj.constructor.toString().match(reg)
				if(!matchArr) return false 
				objType = matchArr[1]
			}
			// if(type==='Function') return objType===type && typeof(obj)==='function'//应对Object.create(Function.prototype)
			return objType===type 
		})		
	}
}

const  isFunction = isTypeof('Function')

export function asyncFunction (fn){
	const isNativePromise = isTypeof('Promise');

	if(!process && process.nextTick) asyncFunction = process.nextTick;
	else if(isNativePromise(Promise)){
		const nativePromise = new Promise((resolve,reject)=>{
			try{
				resolve(value)
			}catch(error){
				reject(error)
			}
		})
		const defaultReject = err => {throw(err)};
		const proxyThen = function(fn){
			return nativePromise.then(fn,defaultReject);
		}
		asyncFunction = proxyThen;//其实也可以不用代理，因为原生的promise内部就有默认错误处理函数
	}
	else if(isFunction(setImmediate)) asyncFunction = setImmediate
	else asyncFunction = setTimeout

	return asyncFunction(fn);
}