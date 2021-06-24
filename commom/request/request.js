/**
 * 注意：
 * 不需要写showLoading,但为了保证加载框不会频闪，需要手动在页面中最后一次请求接口的方法内调用this.hideLoading()关闭加载框
 */

import Vue from 'vue'
import {addSign} from './sign.js'
import utils from '../util.js'
/**
 * post请求
 * @param {Object} url  接口地址
 * @param {Object} data 请求数据
 * @param {Object} callback 返回数据且数据正常的回调
 * @param {Object} title 单次请求时 显示在前端的标题，可不传，默认为‘加载中...’
 */
function post(url,data,callback,title) {
	 const personal=utils.getPersonal()
	 const signData =addSign({
	 	app_code: personal.app_code,
	 	platform_code: personal.platform_code,
	 	unit_code: personal.unit_code,
	 	index_code: personal.index_code,
	 	access_token: personal.access_token,
		...data,
	 })
	 Vue.prototype.showLoading(title||'')//在最开始显示一个加载框
	 console.log(url,JSON.stringify(signData));
	 let reuqestTask=uni.request({
	 	url: url,
	 	method: 'POST',
	 	header: {'content-type': 'application/json'},
	 	data: signData,
	 	success: res => {//接口调用成功的回调函数
			if(res.statusCode===200){
				if(res.data.state==='fail'){
					console.log(res.data);
					uni.hideLoading()
					showToast(res.data.msg)
				}else{
					callback(res.data)
				}
			}else{
				console.log(res);
				uni.hideLoading()
				console.log(process.env.NODE_ENV);
				if(process.env.NODE_ENV==="development"){//开发环境，提示具体信息，生产环境，提示其他信息
					showToast(res.data.Message)
				}else{
					showToast('网络请求失败')
				}
			}
	 	},
	 	fail: (e) => {//接口调用失败的回调函数
	 		console.log(e);
			uni.hideLoading()
			showToast('网络连接超时')
	 	},
		complete: () => {
			Vue.prototype.requestTask.delete(reuqestTask)
			
		}
	 });
	Vue.prototype.requestTask.set(reuqestTask,true)
	
}

/** 
 * get请求
 * 未进行相关测试，需求未明确，调用需谨慎
 * @param {Object} url  接口地址
 * @param {Object} data 请求数据
 * @param {Object} callback 返回数据且数据正常的回调
 */
function get(url,data,callback,title) {
	 const personal=utils.getPersonal()
	 const signData =addSign({
	 	app_code: personal.app_code,
	 	platform_code: personal.platform_code,
	 	unit_code: personal.unit_code,
	 	index_code: personal.index_code,
	 	...data,
	 	access_token: personal.access_token,
	 })
	 Vue.prototype.showLoading(title||'')//在最开始显示一个加载框
	 console.log(url, JSON.stringify(signData))
	 let reuqestTask=uni.request({
	 	url: url,
	 	method: 'GET',
	 	header: {'content-type': 'application/json'},
	 	data: signData,
	 	success: res => {//接口调用成功的回调函数
			if(res.statusCode===200){
				if(res.data.state==='fail'){
					console.log(res.data);
					showToast(res.data.msg)
					uni.hideLoading()
				}else{
					callback(res.data)
				}
			}else{
				console.log(res);
				uni.hideLoading()
				showToast('网络请求失败')
			}
	 	},
	 	fail: (e) => {//接口调用失败的回调函数
	 		console.log(e);
			uni.hideLoading()
			showToast('网络连接超时')
	 	},
		complete: () => {
			Vue.prototype.requestTask.delete(reuqestTask)
		}
	 });
	 Vue.prototype.requestTask.set(reuqestTask,true)
}

function showToast(title){
	uni.showToast({
		icon:'none',
		title:title,
		duration:1500
	});
}

module.exports = {
	post: post,
	get:get
}
