import Functions from './main.js'
import Collections from './Colletion.js'
const _ = {}

[Functions,Collections].forEach((module)=>{
	Object.keys(module).forEach(fnName=>{
		_[fnName] = module[fnName];
	})
})

export default _;



