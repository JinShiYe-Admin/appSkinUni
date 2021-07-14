import Vue from 'vue'
import App from './App'
import {post} from 'commom/request/request.js'
import uView from './third-ui/uview-ui'
import util from './commom/util.js'
import moment from 'moment'
Vue.use(uView);
//配置项开始
const GLOBALDATA = {};//参数对象 用于存全局公共参数
const EnvKey = 3; //1:山东开发 2:广西开发 3:联测 4:云测 5:正式 6性能测试   
switch (EnvKey) {
	case 1:
		GLOBALDATA.EnvKey = EnvKey ;
		GLOBALDATA.PLATFORMCODE ='PT0002' ;//平台代码
		GLOBALDATA.APPCODE ='schappWxUni#' ;//应用系统代码
		GLOBALDATA.UNITCODE ='100004' ;//单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
		
		GLOBALDATA.QN_APPID =15;//七牛appid
		GLOBALDATA.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
	case 2:
		GLOBALDATA.EnvKey = EnvKey ;
		GLOBALDATA.PLATFORMCODE ='PT0002' ;//平台代码
		GLOBALDATA.APPCODE ='schappWxUni#' ;//应用系统代码
		GLOBALDATA.UNITCODE ='100004' ;//单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
		
		GLOBALDATA.QN_APPID =15;//七牛appid
		GLOBALDATA.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
	case 3:
		GLOBALDATA.EnvKey = EnvKey ;
		GLOBALDATA.PLATFORMCODE ='PT0003';//平台代码
		GLOBALDATA.APPCODE ='schappWxUni#';//应用系统代码
		GLOBALDATA.UNITCODE ='-1' ;//单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
		
		GLOBALDATA.INTERFACE_SSO_SKIN ='http://nwifapp.jiaobaowang.net/ssotoskin/api/skin/';//单点登录,供PC外皮及APP用户登录,管理
		GLOBALDATA.INTERFACE_SSO_HR ='http://nwifapp.jiaobaowang.net/ssotohr/api/hr/';//单点登录,供人事系统使用
		GLOBALDATA.INTERFACE_SUP_HR ='http://nwifapp.jiaobaowang.net/suptohr/api/hr/';//单点对人事及登录皮肤接口
		GLOBALDATA.INTERFACE_SSO_SUB ='http://nwifapp.jiaobaowang.net/ssotosub/api/sub/';//单点登录,供各子系统用
		GLOBALDATA.INTERFACE_HR_SUB ='http://nwifapp.jiaobaowang.net/testhrunvtosub/api/sub/';//人事接口,供子系统用
		GLOBALDATA.INTERFACE_HR_SKIN ='http://nwifapp.jiaobaowang.net/testhrunvtosup/api/skin/';//人事接口,供APP或PC注册及外皮用
		GLOBALDATA.INTERFACE_UNVEDUSUBAPI ='http://139.129.252.49:8180/unvedusubapi/api/';//继续教育接口文档 供展示前台
		
		
		GLOBALDATA.QN_APPID =16;//七牛appid
		GLOBALDATA.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
	case 4:
		GLOBALDATA.EnvKey = EnvKey ;
		GLOBALDATA.PLATFORMCODE ='PT0007' ;//平台代码
		GLOBALDATA.APPCODE ='schappUni#' ;//应用系统代码
		GLOBALDATA.UNITCODE ='-1' ;//单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
		
		GLOBALDATA.INTERFACE_SSO_SKIN = 'http://nwifapp.jiaobaowang.net/ssotoskin/api/skin/'; //单点登录,供PC外皮及APP用户登录,管理  单点对人事及登录皮肤接口
		GLOBALDATA.INTERFACE_SSO_HR = 'http://nwifapp.jiaobaowang.net/ssotohr/api/hr/'; //单点登录,供人事系统使用                  单点对人事及登录皮肤接口
		GLOBALDATA.INTERFACE_SUP_HR = 'http://nwifapp.jiaobaowang.net/suptohr/api/hr/'; //单点登录,供人事系统使用                  单点对人事及登录皮肤接口
		GLOBALDATA.INTERFACE_SSO_SUB = 'http://nwifapp.jiaobaowang.net/ssotosub/api/sub/'; //单点登录,供各子系统用 			     单点对子系统接口
		GLOBALDATA.INTERFACE_HR_SUB = 'http://nwifapp.jiaobaowang.net/hrunvtosub/api/sub/'; //人事接口,供子系统用 				     人事对子系统接口
		GLOBALDATA.INTERFACE_HR_SKIN = 'http://nwifapp.jiaobaowang.net/hrunvtosup/api/skin/'; //人事接口,供APP或PC注册及外皮用        人事对单点及登录皮肤接口
		GLOBALDATA.INTERFACE_UNVEDUSUBAPI ='http://nwifapp.jiaobaowang.net/unvedusubapi/api/';//继续教育接口文档 供展示前台
		
		GLOBALDATA.QN_APPID =16;//七牛appid
		GLOBALDATA.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
	case 5:
		GLOBALDATA.EnvKey = EnvKey ;
		GLOBALDATA.PLATFORMCODE ='PT0002' ;//平台代码
		GLOBALDATA.APPCODE ='schappUni#' ;//应用系统代码
		GLOBALDATA.UNITCODE ='-1' ;//单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
		
		GLOBALDATA.INTERFACE_SSO_SKIN = 'http://sso.108800.com:8080/ssotoskin/api/skin/'; // 单点对登录框接口
		GLOBALDATA.INTERFACE_SSO_HR = 'http://sso.108800.com:8080/ssotohr/api/hr/'; // 单点对人事接口 (gu )
		GLOBALDATA.INTERFACE_SUP_HR = 'http://sso.108800.com/suptohr/api/hr/'; //单点对人事及登录皮肤接口  (zeng)
		GLOBALDATA.INTERFACE_SSO_SUB = 'http://sso.108800.com:8080/ssotosub/api/sub/'; // 单点对子系统接口
		GLOBALDATA.INTERFACE_HR_SUB = 'http://apps.108800.com/hrunvtosub/api/sub/'; //人事接口,供子系统用 				     人事对子系统接口
		GLOBALDATA.INTERFACE_HR_SKIN = 'http://apps.108800.com/hrunvtosup/api/skin/'; //人事接口,供APP或PC注册及外皮用        人事对单点及登录皮肤接口
		GLOBALDATA.INTERFACE_UNVEDUSUBAPI ='http://139.129.252.49:8180/unvedusubapi/api/';//继续教育接口文档 供展示前台
		
		GLOBALDATA.QN_APPID =17;//七牛appid
		GLOBALDATA.QN_APPKEY ='oafor1010'; //七牛appkey
		break;
	case 6:
		GLOBALDATA.EnvKey = EnvKey ;
		GLOBALDATA.PLATFORMCODE ='PT0002' ;//平台代码
		GLOBALDATA.APPCODE ='schappWxUni#' ;//应用系统代码
		GLOBALDATA.UNITCODE ='100001' ;//单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
		
		GLOBALDATA.QN_APPID =16;//七牛appid
		GLOBALDATA.QN_APPKEY ='oatest1010'; //七牛appkey
		break;
}
Vue.prototype.APPORWECHAT =1;//app为1，微信里面是2
Vue.prototype.PRIVACE='http://www.jiaobao.net/dl/jiaobaoxiaoyuan/jbdxyPrivacy.htm';//用户隐私政策地址
Vue.prototype.QN_PV_NAME ='jbsch-pv';//七牛私有空间名
Vue.prototype.QN_PB_NAME ='jbsch-pb';//七牛公有空间名
Vue.prototype.QNPB = 'https://qn-educds.jiaobaowang.net/'; //公开空间域名
Vue.prototype.QNGETUPLOADTOKEN = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen';
Vue.prototype.QNGETUPTOKENHEADIMGE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
Vue.prototype.QNGETUPTOKENFILE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
Vue.prototype.QNGETDOWNTOKENFILE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
Vue.prototype.QNGETTOKENDELETE = 'https://jbyc.jiaobaowang.net:8504/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
Vue.prototype.QN_HEADIMG = "headImg/"; //头像

Vue.prototype.PWD_ENCRYPTION ='#@_JFnice_@#';//修改密码时，加密密钥
Vue.prototype.SECRETKEY ='jsy309';//sign签名时需要的盐
//配置项结束

//以下内容不需要修改
Vue.prototype.globaData=GLOBALDATA; //参数对象 用于存全局公共参数
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
Vue.prototype.meunListMore="MENULISTMORE"//登录用户菜单信息存入storage时key的名称
Vue.prototype.tabbarMenu="TABBARMENU"//点击tabbar时，传菜单内容
Vue.prototype.post=post //引入全局请求
Vue.prototype.moment=moment;//全局时间插件
Vue.prototype.getPermissionByPosition=util.getPermissionByPosition //全局获取按钮权限
Vue.prototype.showToast=util.showToast //引入全局Toast
Vue.config.productionTip = false //不知道啥用
App.mpType = 'app'
const app = new Vue({
	...App
})

app.$mount()
