import _Object from './Object.js'

const _ = {}
_.shuffle = (obj)=>{
	let arr = Array.isArray(obj)?[].concat(obj): Object.keys(obj).map(v=>obj[v]);

	const len = arr.length;
	for(let i=0;i<len-1;i++){
		const randomIndex = Math.floor(Math.random()* (len-i-1)) + (i+1);    
		swap(arr,i,randomIndex);
	}
	return arr;

	function swap(nums,i,j){
		let temp = nums[j];
		nums[j] = nums[i];
		nums[i] = temp; 
	}
}

/**
 * 一个用来创建整数灵活编号的列表的函数，便于each 和 map循环。
 * 如果省略start则默认为 0；step 默认为 1.返回一个从start 
 * 到stop的整数的列表，用step来增加 （或减少）独占。值得注意的是，
 * 如果stop值在start前面（也就是stop值小于start值），
 * 那么值域会被认为是零长度，而不是负增长。-如果你要一个负数的值域 ，
 * 请使用负数step.
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
 */
_.range = (...args)=>{
	let start = 0,stop,step = 1,len = args.length,result = [];
	if(len===0) return;
	if(len==1) stop = args[0];
	else if(len===2) [start,stop] = args;
	else if(len>=3) [start,stop,step] = args.slice(0,3);
	
	if(stop<start && step>0) return [];

	if(step>0)
		for(let i=start;i<stop;i+=step) result.push(i);
	else{
		for(let i=start;i>stop;i+=step) result.push(i);
	}
	return result;
}

/**
 * count为1，则随机选择，不进行排序。注意其中如果是obj的话，找values。
 * @param  {[type]} list  [description]
 * @param  {Number} count [description]
 * @return {[type]}       [description]
 */
_.sample = (list,count=1)=>{
	if(count===1){
		let arr = list;
		if(!Array.isArray(list)) arr = _Object.values(list);
		const len = arr.length,randomIndex = Math.floor(Math.random()*len);
		return arr[randomIndex];
	}
	return _.shuffle(list).slice(0,count);
}

export default _;