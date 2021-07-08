/**
 * 注意：
 * APP端多次调用showLoading会导致加载框频闪，所以为了保证加载框不会频闪，尽量避免多次调用
 * 需手动在页面中最后一次请求接口的方法内调用this.hideLoading()关闭加载框
 */

import Vue from 'vue'
import {
	addSign
} from './sign.js'
import utils from '../util.js'

/**
 * post请求
 * @param {Object} url  接口地址
 * @param {Object} data 请求数据
 * @param {Object} callback 返回数据且数据正常的回调
 * @param {Object} ecallback 返回数据调用失败的回调 默认可不传 如果需要根据错误信息去重置页面的某个状态，可以传入
 */
function post(url, data, callback, ecallback) {
	let personal = utils.getPersonal();
	// console.log('post.personal:'+JSON.stringify(personal));
	let signData = addSign({
		app_code: personal.app_code,
		platform_code: personal.platform_code,
		unit_code: personal.unit_code,
		index_code: personal.index_code,
		access_token: personal.access_token,
		...data,
	})
	console.log(url, JSON.stringify(signData));
	let reuqestTask = uni.request({
		url: url,
		method: 'POST',
		header: {
			'content-type': 'application/json; charset=UTF-8'
		},
		data: signData,
		success: res => { //接口调用成功的回调函数
			if (res.statusCode === 200) {
				if (res.data.state === 'fail') {
					// console.log('failfailfail:'+JSON.stringify(res.data));
					uni.hideLoading()
					if (res.data.code === 'sup_0015') {
						showToast(res.data.msg)
						utils.setPersonal({});
						uni.reLaunch({
						    url:'/pages/login/login'
						});
					} else if (res.data.code == 6 || res.data.code == 'sup6' || res.data.code == '0006' ||
						res.data.code == 'sup_0006') { //令牌过期
						let deviceId = utils.getDeviceId();
						let broswerId = utils.getBroswerId();
						var tempToken = {
							index_code: 'index',
							user_code: personal.user_code, //登录名
							uuid: deviceId, //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
							webid: broswerId, //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
							device_type: '1' //登录设备类型，0：WEB、1：APP、2：客户端
						}
						//令牌续订
						post(this.globaData.INTERFACE_SSO_SKIN + 'token/refresh', tempToken, (tempD,
							data1) => {
								// console.log('refreshToken:'+JSON.stringify(data1));
								if (data1.code == 0) {
									var tempInfo00 = utils.getPersonal();
									tempInfo00.access_token = data1.data.access_token;
									utils.setPersonal(tempInfo00);
									var urlArr = url.split('/');
									console.log('signData:'+JSON.stringify(signData));
									// var tempData = JSON.parse(signData);
									var tempData = signData;
									tempData.access_token = data1.data.access_token;
									delete tempData.sign;
									post(url, tempData, (dataT,data2)=> {
										// console.log('data2data2:'+JSON.stringify(data2));
										// data2 = modifyParameter(url, data2);
										// callback(data2);
										callback(data2.data, data2);
									});
								} else {
									showToast(data1.msg);
								}
							});
					}else{
						showToast(res.data.msg);
					}
				} else {
					// console.log('success:'+JSON.stringify(res.data));
					if (res.data.code === '0000') {
						callback(res.data.data, res.data)
					} else {
						uni.hideLoading()
						showToast(res.data.msg)
					}
				}
			} else {
				uni.hideLoading()
				if (process.env.NODE_ENV === "development") { //开发环境，提示具体信息，生产环境，提示其他信息
					showToast(res.data.Message)
				} else {
					showToast('网络请求异常')
				}
				if (ecallback) {
					ecallback(res.data)
				}
			}
		},
		fail: (e) => { //接口调用失败的回调函数
			console.log("e: " + JSON.stringify(e));
			uni.hideLoading()
			if (ecallback) {
				ecallback(e)
			}
			showToast('网络请求失败')
		},
		complete: () => {
			Vue.prototype.requestTask.delete(reuqestTask)
		}
	});
	Vue.prototype.requestTask.set(reuqestTask, true)

}

/** 
 * get请求
 * 未进行相关测试，需求未明确，调用需谨慎
 * @param {Object} url  接口地址
 * @param {Object} data 请求数据
 * @param {Object} callback 返回数据且数据正常的回调
 * @param {Object} ecallback 返回数据调用失败的回调 默认可不传 如果需要根据错误信息去重置页面的某个状态，可以传入
 */
function get(url, data, callback, ecallback) {
	const personal = utils.getPersonal()
	const signData = addSign({
		app_code: personal.app_code,
		platform_code: personal.platform_code,
		unit_code: personal.unit_code,
		index_code: personal.index_code,
		...data,
		access_token: personal.access_token,
	})
	console.log(url, JSON.stringify(signData))
	let reuqestTask = uni.request({
		url: url,
		method: 'GET',
		header: {
			'content-type': 'application/json; charset=UTF-8'
		},
		data: signData,
		success: res => { //接口调用成功的回调函数
			if (res.statusCode === 200) {
				if (res.data.state === 'fail') {
					showToast(res.data.msg)
					uni.hideLoading()
				} else {
					callback(res.data.data, res.data)
				}
			} else {
				uni.hideLoading()
				if (process.env.NODE_ENV === "development") { //开发环境，提示具体信息，生产环境，提示其他信息
					showToast(res.data.Message)
				} else {
					showToast('网络请求失败')
				}
				if (ecallback) {
					ecallback(res.data)
				}
			}
		},
		fail: (e) => { //接口调用失败的回调函数
			console.log('fail', e);
			uni.hideLoading()
			showToast('网络连接超时')
		},
		complete: () => {
			Vue.prototype.requestTask.delete(reuqestTask)
		}
	});
	Vue.prototype.requestTask.set(reuqestTask, true)
}
var timeTask = null

function showToast(title) {
	if (timeTask) {
		clearTimeout(timeTask)
	}
	timeTask = setTimeout(() => {
		//#ifdef APP-PLUS
		plus.nativeUI.toast(title);
		//#endif
		//#ifndef APP-PLUS
		uni.showToast({
			icon: 'none',
			title: title,
			position: 'bottom',
			duration: 2000,
		});
		//#endif
	}, 50)
}

module.exports = {
	post: post,
	get: get
}
