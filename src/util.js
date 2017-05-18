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

export const  isFunction = isTypeof('Function')