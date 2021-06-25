 /**
  * 如果业务是嵌套的请求，那么在最后一个嵌套请求结束后关闭这个加载框 
  * 如果期间某个接口出现错误，会立即关闭加载框
  * this.showLoading() ---------------loading begin		
  * this.post(url,data,()=>{
		this.post(url,data,()=>{
			this.post(url,data,()=>{
				this.post(url,data,()=>{
					this.post(url,data,()=>{
						this.post(url,data,()=>{
							this.post(url,data,()=>{
								this.hideLoading()	---------------loading end					 
							})						 
						})						 
					})						 
				})						 
			})							 
		})
	})
  */
 /**
  * 如果业务是嵌套的并行请求，那么在最后一层嵌套的多个请求结束后关闭加载框
  * 如果期间某个接口出现错误，会立即关闭加载框
  *  this.showLoading() ---------------loading begin		
  *  this.post(url,data,()=>{
	  this.post(url,data,()=>{
		  this.post(urlA,data,()=>{  this.hideLoading()  }) ---------------loading end	
		  this.post(urlB,data,()=>{  this.hideLoading()  }) ---------------loading end	
		  this.post(urlC,data,()=>{  this.hideLoading()  }) ---------------loading end	
		  this.post(urlD,data,()=>{  this.hideLoading()  }) ---------------loading end	
	  })
   })
  */

<template>
	<view>
		<p>{{loginInfo}}</p>
		<button type="default" @tap="login">登录</button>
		<button type="default" @tap="toPage">跳转与传参</button>
		<scroll-view scroll-y="true" >
			<y-json-view :json="jsonData"/>
		</scroll-view>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	import RSAKey from '../../commom/encrypt/rsa.js'
	export default {
		 data() {
		 	return {
		 		 loginInfo:'用户名：xxld  密码：111111a',
				 jsonData:[],
		 	}
		 },
		 methods:{
			toPage:function(){
					if(this.jsonData.length===0){
						uni.showToast({
							icon:'none',
							title:'请先登录',
							duration:1500
						}) 
					}else{
						util.openwithData('./detail',this.jsonData,{
							test1:function(data){
								console.log(data);
							},
							test2:function(data){
								console.log(data);
							}
						})
					}
			},
			login:function(){
				 this.showLoading()
				 let deviceId=util.getDeviceId();
				 let broswerId=util.getBroswerId();
				 let comData = {
				 	platform_code: this.globaData.PLATFORMCODE, //平台代码
				 	app_code: this.globaData.APPCODE, //应用系统代码
				 	unit_code: '-1', //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
				 	uuid:deviceId, //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
				 	webid: broswerId, //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
				 	shaketype: '1', //
				 };
				 this.request.post(this.globaData.INTERFACE_SSO_SKIN+'login/getEncryptKey',comData,response=>{
					 if(response.code==='0000'){
						 let data=response.data
						 let ConsultPublicKey = { n: String(data.Modulus), e: String(data.Exponent) }
						 let rsaPublicKey = new RSAKey()
						 rsaPublicKey.setPublicString(JSON.stringify(ConsultPublicKey))
						 let comData = {
						 	uuid: deviceId, //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
						 	webid: broswerId, //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
						 	shaketype: '1', //
						 	login_name: rsaPublicKey.encrypt('xxld'), //登录名
						 	password: rsaPublicKey.encrypt('111111a'), //
						 	device_type: '1', //登录设备类型，0：WEB、1：APP、2：客户端
						 	platform_code: this.globaData.PLATFORMCODE, //平台代码
						 	app_code: this.globaData.APPCODE, //应用系统代码
						 	unit_code: '-1', //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
						 	verify_code: ''
						 };
						 this.request.post(this.globaData.INTERFACE_SSO_SKIN+'login',comData,response=>{
								util.setPersonal(response.data)
								let tempFlag = 0;
								//登录用户岗位信息
								let comData3 = {
									platform_code: response.data.user.platform_code, //平台代码
									app_code: response.data.user.app_code, //应用系统代码
									index_code: 'index', //页面权限符,必传,从登录皮肤处获得
									unit_code: response.data.user.unit_code, //学校代码,必传
									user_code: response.data.user.user_code, //用户代码,必传
									access_token: response.data.access_token //用户令牌
								};
								this.request.post(this.globaData.INTERFACE_HR_SUB+'user/getUserImg',comData3,data3=>{
									console.log("data3: " + JSON.stringify(data3));
									this.hideLoading()
									if (data3.code == 0) {
										let tempPerInfo = util.getPersonal();
										tempPerInfo.hrImg_url = data3.data.user_img;
										util.setPersonal(tempPerInfo);
										tempFlag++;
										console.log('tempFlag01:' + tempFlag);
										if (tempFlag == 3) {
											//跳转界面
											this.gotoPage()
										}
									} else {
										uni.showToast({
											icon:'none',
											title:data3.msg,
											duration:1500
										})
									}
								})
								
								//1.4获取菜单
								//不需要加密的数据
								var comData4 = {
									platform_code: this.globaData.PLATFORMCODE, //平台代码
									app_code: this.globaData.APPCODE, //应用系统代码
									unit_code: response.data.user.unit_code,
									index_code:'index',
									access_token: response.data.access_token //用户令牌
								};
								//登录用户岗位信息
								this.request.post(this.globaData.INTERFACE_SSO_SKIN + 'acl/menu',comData4,data4=>{
									this.hideLoading()
									if (data4.code == 0) {
										if (data4.data.list.length > 0) {
											util.setMenu(data4.data)
											tempFlag++;
											console.log('tempFlag02:' + tempFlag);
											if (tempFlag == 3) {
												//跳转界面
												this.gotoPage()
											}
										} else {
											uni.showToast({
												icon:'none',
												title:'应用系统无权限，请联系管理员',
												duration:1500
											})
										}
									} else {
										uni.showToast({
											icon:'none',
											title:data4.msg,
											duration:1500
										})
									}
								})
								//1.42.根据用户类型及代码查询教师/学生信息
								var comData5 = {
									platform_code: this.globaData.PLATFORMCODE, //平台代码
									app_code: this.globaData.APPCODE, //应用系统代码
									unit_code: response.data.user.unit_code,
									user_type_code:response.data.user.type_code,
									user_code:response.data.user.user_code,
									index_code:'index',
									access_token: response.data.access_token //用户令牌
								};
								this.request.post(this.globaData.INTERFACE_HR_SUB + 'user/getUserInfoByTypeAndCode',comData5,data5=>{
									this.hideLoading()
									if (data5.code == '0000') {
										if (data5.data) {
											var tempPerInfo = util.getPersonal();
											if (response.data.user.type_code == 'YHLX0003') {
												tempPerInfo.tec_name = data5.data.tec_name;
												tempPerInfo.sch_name = data5.data.sch_name;
												tempPerInfo.sch_code = data5.data.sch_code;
												tempPerInfo.tec_code = data5.data.tec_code;
												tempPerInfo.dpt_name = data5.data.dpt_name;
												tempPerInfo.dpt_code = data5.data.dpt_code;
											} else{
												tempPerInfo.cls_name = data5.data.cls_name;
												tempPerInfo.sch_name = data5.data.sch_name;
												tempPerInfo.sch_code = data5.data.sch_code;
												tempPerInfo.cls_code = data5.data.cls_code;
												tempPerInfo.grd_name = data5.data.grd_name;
												tempPerInfo.grd_code = data5.data.grd_code;
												tempPerInfo.stu_name = data5.data.stu_name;
												tempPerInfo.stu_code = data5.data.stu_code;
											}
											util.setPersonal(tempPerInfo)
											tempFlag++;
											console.log('tempFlag02:' + tempFlag);
											if (tempFlag == 3) {
												//跳转界面
												this.gotoPage()
											}
										} else {
											uni.showToast({
												icon:'none',
												title:'应用系统无权限，请联系管理员',
												duration:1500
											})
										}
									} else {
										uni.showToast({
											icon:'none',
											title:data5.msg,
											duration:1500
										})
									}
								})
						 },'正在登录...')
					 }else{
						 uni.showToast({
						 	icon:'none',
						 	title:'获取秘钥失败',
						 	duration:1500
						 });
					 }
				 })  
			},
			gotoPage:function(){
				let tempData = util.getPersonal();
				//将personal 中的key更改为指定的值
				tempData.user_name = tempData.user.user_name;
				tempData.sex = tempData.user.sex;
				tempData.pid = tempData.user.pid;
				tempData.unit_name = tempData.user.unit_name;
				tempData.login_name = tempData.user.login_name;
				tempData.platform_code = tempData.user.platform_code;
				tempData.user_code = tempData.user.user_code;
				tempData.img_url = tempData.user.img_url;
				tempData.platform_name = tempData.user.platform_name;
				tempData.unit_code = tempData.user.unit_code;
				tempData.id = tempData.user.id;
				tempData.type_code = tempData.user.type_code;
				tempData.app_code = tempData.user.app_code;
				delete tempData['user'];
				console.log('new tempData:' + JSON.stringify(tempData));
				util.setPersonal(tempData)
				if ('111111a' == '123456') {
					var tempModel = {
						flag: 1 //0是主动修改密码，1是判断是默认密码，自动让修改
					}
					// utils.mOpenWithData("../../html/mine/modifyPassword.html", tempModel);
				} else {
					if (tempData.user_code == '0') { //无权限
						// utils.hrefSessionStorage('../../html/login/index2.html', {});
					} else {
						// utils.hrefSessionStorage('../../html/login/index.html', {});
						console.log("跳转页面吧");
						this.jsonData=tempData
					}
				}
			}
		 },
		 onLoad:function(){
		 }
	} 
</script>

<style>
	.content{
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	}
</style>
