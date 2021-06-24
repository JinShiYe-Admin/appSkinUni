/**
 * APP 工具类
 */
import Vue from 'vue'
import moment from 'moment'

/**
 * 获取当前时间 
 * formart:为格式化时间戳需要的格式('YYYY-MM-DD HH:mm:ss')，如果不传，默认返回时间戳
 */
function now(formart){
	return moment().format(formart)
}

/**
 * 根据指定key 给数组去重
 * @param {Object} arr 数组
 * @param {Object} key 数组中对象含有的key
 */
function unique(arr,key){
	let n = [arr[0]];
	for(let i = 1; i < arr.length; i++) {
		if(key === undefined) {
			if(n.indexOf(arr[i]) == -1) n.push(arr[i]);
		} else {
			inner: {
				var has = false;
				for(let j = 0; j < n.length; j++) {
					if(arr[i][key] == n[j][key]) {
						has = true;
						break inner;
					}
				}
			}
			if(!has) {
				n.push(arr[i]);
			}
		}
	}
	return n;
}

/**
 * 获取有层级关系的部门数组  
 * （应用场景：人事接口返回的部门数组为一维数组，需要根据dpt_code自行分层）
 * @param {Object} dptList
 */
function getDptTree(dptList) {
	const map = {};
	const val = [];
	dptList.forEach((item) => {
		map[item.dpt_code] = item;
	});
	dptList.forEach((item) => {
		const parent = map[item.pcode];
		if (parent) {
			(parent.children || (parent.children = [])).push(item);
		} else {
			val.push(item);
		}
	});
	return val
}

//设置登录用户的信息
function setPersonal(data){
	uni.setStorageSync(Vue.prototype.personal,JSON.stringify(data))
}
//获取登录用户的信息
function getPersonal(){
	const _value=uni.getStorageSync(Vue.prototype.personal)
	if(_value){return JSON.parse(_value)}else{return {}}
}
//清除登录用户的信息
function removePersonal(){
	uni.removeStorageSync(Vue.prototype.personal);
}

//设置登录用户的菜单信息
function setMenu(data){
	uni.setStorageSync(Vue.prototype.meunList,JSON.stringify(data))
}
//获取登录用户的菜单信息
function getMenu(){
	const _value=uni.getStorageSync(Vue.prototype.meunList)
	if(_value){return JSON.parse(_value)}else{return {}}
}
//清除登录用户的菜单信息
function removeMenu(){
	uni.removeStorageSync(Vue.prototype.meunList);
}

//清除本地所有storage缓存
function clearStorage(){
	try {
	    uni.clearStorageSync();
	} catch (e) {
	   console.log(e);
	}
}

/**
 * 获取设备唯一识别码
 * 注意：官网文档解释——非 App 端由 uni-app 框架生成并存储，清空 Storage 会导致改变
*/
function getDeviceId(){
	const res = uni.getSystemInfoSync();
	return res.deviceId
}
//获取浏览器识别码
function getBroswerId(){
	const res = uni.getSystemInfoSync();
	let system=res.system
	return system.replace(/\s*/g,"");
	
}
//获取设备
module.exports = {
	getDptTree: getDptTree,
	unique: unique,
	now: now,
	setPersonal:setPersonal,
	getPersonal:getPersonal,
	removePersonal:removePersonal,
	setMenu:setMenu,
	getMenu:getMenu,
	removeMenu:removeMenu,
	clearStorage:clearStorage,
	getDeviceId:getDeviceId,
	getBroswerId:getBroswerId,
}
