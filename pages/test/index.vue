<template>
	<view class="content">
			<p>{{loginInfo}}</p>
			<button type="default" @tap="login">登录</button>
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
				 jsonData:[]
		 	}
		 },
		 methods:{
			login:function(){
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
								//this.hideLoading() 
								// uni.showToast({
								// 	icon:'none',
								// 	title:'登陆成功'+JSON.stringify(response),
								// 	duration:1500
								// })
								this.jsonData=response.data
						 },'正在登录...')
						 
						 //Test
						 setTimeout(()=>{
							 this.request.post(this.globaData.INTERFACE_SSO_SKIN+'login',comData,response=>{
							 		console.log("response: " + JSON.stringify(response));
							 		this.hideLoading() 
							 })
							 this.request.post(this.globaData.INTERFACE_SSO_SKIN+'login',comData,response=>{
							 		console.log("response: " + JSON.stringify(response));
							 		this.hideLoading() 
							 })
							 //Test sign error
							 comData.test='123'
							 this.request.post(this.globaData.INTERFACE_SSO_SKIN+'login',comData,response=>{
							 		console.log("response: " + JSON.stringify(response));
							 		this.hideLoading() 
							 })
							 this.request.post(this.globaData.INTERFACE_SSO_SKIN+'login',comData,response=>{
							 		console.log("response: " + JSON.stringify(response));
							 		this.hideLoading() 
							 })
						 },2345)
						 /**
						  * 如果业务是嵌套的请求，那么在最后一个嵌套请求结束后关闭这个加载框 其他请求地方不需要写
						  * 如果期间某个接口出现错误，会立即关闭加载框
						  * this.post(url,data,()=>{
								this.post(url,data,()=>{
									this.post(url,data,()=>{
										this.post(url,data,()=>{
											this.post(url,data,()=>{
												this.post(url,data,()=>{
													this.post(url,data,()=>{
														this.hideLoading()						 
													})						 
												})						 
											})						 
										})						 
									})							 
								})
							})
						  */
						 /**
						  * 如果业务是嵌套的并行请求，那么在最后一层嵌套的多个请求结束后关闭加载框，不需要关心其中一个请求结束后加载框关闭的情况，框架会自动在最后一个请求得到返回后值才会关闭加载框
						  * 如果期间某个接口出现错误，会立即关闭加载框
						  *  this.post(url,data,()=>{
							  this.post(url,data,()=>{
								  this.post(urlA,data,()=>{  this.hideLoading()  })
								  this.post(urlB,data,()=>{  this.hideLoading()  })
								  this.post(urlC,data,()=>{  this.hideLoading()  })
								  this.post(urlD,data,()=>{  this.hideLoading()  })
							  })
						   })
						  */
					 }else{
						 uni.showToast({
						 	icon:'none',
						 	title:'获取秘钥失败',
						 	duration:1500
						 });
					 }
				 },'正在获取秘钥')  
			},
			trigger:function(){
				console.log(123);
			}
		 },
		 onLoad:function(){
		 }
		 
	} 
</script>

<style >
	.content{
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	}
</style>
