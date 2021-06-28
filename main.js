import Vue from 'vue'
import App from './App'
import {post,get} from 'commom/request/request.js'
import uView from './third-ui/uview-ui'
Vue.use(uView);
//配置项开始
const COMMON = {};//参数对象 用于存全局公共参数
const EnvKey = 3; //1:山东开发 2:广西开发 3:联测 4:云测 5:正式 6性能测试   
switch (EnvKey) {
	case 1:
		COMMON.PLATFORMCODE ='PT0002' ;//平台代码
		COMMON.APPCODE ='schappUni#' ;//应用系统代码
		
		COMMON.QN_APPID =15;//七牛appid
		COMMON.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
	case 2:
		COMMON.PLATFORMCODE ='PT0002' ;//平台代码
		COMMON.APPCODE ='schappUni#' ;//应用系统代码
		
		COMMON.QN_APPID =15;//七牛appid
		COMMON.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
	case 3:
		COMMON.PLATFORMCODE ='PT0003';//平台代码
		COMMON.APPCODE ='schappUni#';//应用系统代码
		
		COMMON.INTERFACE_SSO_SKIN ='http://nwifapp.jiaobaowang.net/ssotoskin/api/skin/';//单点登录,供PC外皮及APP用户登录,管理
		COMMON.INTERFACE_SSO_HR ='http://nwifapp.jiaobaowang.net/ssotohr/api/hr/';//单点登录,供人事系统使用
		COMMON.INTERFACE_SUP_HR ='http://nwifapp.jiaobaowang.net/suptohr/api/hr/';//单点对人事及登录皮肤接口
		COMMON.INTERFACE_SSO_SUB ='http://nwifapp.jiaobaowang.net/ssotosub/api/sub/';//单点登录,供各子系统用
		COMMON.INTERFACE_HR_SUB ='http://nwifapp.jiaobaowang.net/testhrunvtosub/api/sub/';//人事接口,供子系统用
		COMMON.INTERFACE_HR_SKIN ='http://nwifapp.jiaobaowang.net/testhrtosup/api/skin/';//人事接口,供APP或PC注册及外皮用
		COMMON.INTERFACE_UNVEDUSUBAPI ='http://139.129.252.49:8180/unvedusubapi/api/';//继续教育接口文档 供展示前台
		
		
		COMMON.QN_APPID =16;//七牛appid
		COMMON.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
	case 4:
		COMMON.PLATFORMCODE ='PT0002' ;//平台代码
		COMMON.APPCODE ='schappUni#' ;//应用系统代码
		
		COMMON.QN_APPID =16;//七牛appid
		COMMON.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
	case 5:
		COMMON.PLATFORMCODE ='PT0001' ;//平台代码
		COMMON.APPCODE ='schappUni#' ;//应用系统代码
		
		COMMON.QN_APPID =17;//七牛appid
		COMMON.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
	case 6:
		COMMON.PLATFORMCODE ='PT0002' ;//平台代码
		COMMON.APPCODE ='schappUni#' ;//应用系统代码
		
		COMMON.QN_APPID =16;//七牛appid
		COMMON.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
}
Vue.prototype.PRIVACE='http://www.jiaobao.net/dl/jiaobaoxiaoyuan/jbxyPrivacy.htm';//用户隐私政策地址
Vue.prototype.QN_PV_NAME ='jbsch-pv';//七牛私有空间名
Vue.prototype.QN_PB_NAME ='jbsch-pb';//七牛公有空间名
Vue.prototype.QNPB = 'https://qn-educds.jiaobaowang.net/'; //公开空间域名
Vue.prototype.QNGETUPLOADTOKEN = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen';
Vue.prototype.QNGETUPTOKENHEADIMGE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
Vue.prototype.QNGETUPTOKENFILE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
Vue.prototype.QNGETDOWNTOKENFILE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
Vue.prototype.QNGETTOKENDELETE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url

Vue.prototype.PWD_ENCRYPTION ='#@_JFnice_@#';//修改密码时，加密密钥
Vue.prototype.SECRETKEY ='jsy309';//sign签名时需要的盐
//配置项结束

//以下内容不需要修改
Vue.prototype.globaData=COMMON; //参数对象 用于存全局公共参数
Vue.prototype.requestTask=new Map();//用于储存页面请求栈
Vue.prototype.showLoading=(requestTitle='加载中...')=>uni.showLoading({title:String(requestTitle),mask:true})//显示加载框
Vue.prototype.hideLoading=()=>{setTimeout(()=>{if(Vue.prototype.requestTask.size===0){uni.hideLoading()}},100)}//关闭加载框

 //#ifdef H5
 if (process.env.NODE_ENV === 'development') {//如果是H5的开发环境，自动加载vconsole
    const vconsole = require('vconsole')
    Vue.prototype.$vconsole = new vconsole() //使用vconsole  APP和小程序端无法使用 
 }
// #endif

Vue.prototype.personal="PERSONAL"//登录用户信息存入storage时key的名称
Vue.prototype.meunList="MENULIST"//登录用户菜单信息存入storage时key的名称
Vue.prototype.request={post:post,get:get} //引入全局请求

Vue.config.productionTip = false //不知道啥用
App.mpType = 'app'
const app = new Vue({
	...App
})

app.$mount()
