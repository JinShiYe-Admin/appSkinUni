<template>
	<view class="content">
		<view class="titletal">
			<text class="title">{{title}}</text>
		</view>
		<view class="inputView">
			<image class="nameImage" src="../../static/login/name.png"></image>
			<label class="loginLab">账号</label>
			<input class="inputText" type="text" placeholder="请输入账号" value="user" v-model="uname" />
		</view>
		<view class="line"></view>
		<view class="inputView">
			<image class="keyImage" src="../../static/login/key.png"></image>
			<label class="loginLab">密码</label>
			<input class="inputText" password="true" type="text" placeholder="请输入密码" value="pass" v-model="passw" />
		</view>
		<view class="line"></view>
		<view class="loginBtnView"><button class="loginBtn" @tap="login">登录</button></view>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	import RSAKey from '../../commom/encrypt/rsa.js'
	export default {
		data() {
			return {
				loginInfo:{},
				title: '教宝校园大学',
				uname: '',
				passw: '',
				jsonData: [],
				showArray: [],
				pageArray: [{
					// 非凸起按钮未激活的图标，可以是uView内置图标名或自定义扩展图标库的图标
					// 或者png图标的【绝对路径】，建议尺寸为80px * 80px
					// 如果是中间凸起的按钮，只能使用图片，且建议为120px * 120px的png图片
					iconPath: "../../static/tabbar/practive.png",
					// 激活(选中)的图标，同上
					selectedIconPath: "../../static/tabbar/practive_select.png",
					// 显示的提示文字
					text: '练习',
					// 红色角标显示的数字，如果需要移除角标，配置此参数为0即可
					count: 0,
					// 如果配置此值为true，那么角标将会以红点的形式显示
					isDot: false,
					// 如果使用自定义扩展的图标库字体，需配置此值为true
					// 自定义字体图标库教程：https://www.uviewui.com/guide/customIcon.html
					customIcon: false,
					// 如果是凸起按钮项，需配置此值为true
					midButton: false,
					// 点击某一个item时，跳转的路径，此路径必须是pagees.json中tabBar字段中定义的路径
					pagePath: '/pages/course_practice/index', // 1.5.6新增，路径需要以"/"开头
					img_href: "../../img/schapp_work/kaoqin_tab.png",
					url: 'schappUni_CoursePractice',
					childList: []
				}, {
					text: "课程学习", //课程学习
					pagePath: "/pages/course_study/index",
					iconPath: '../../static/tabbar/study.png',
					selectedIconPath: '../../static/tabbar/study_select.png',
					count: 0,
					isDot: false,
					customIcon: false,
					img_href: "../../img/schapp_work/kaoqin_tab.png",
					url: 'schappUni_CourseStudy',
					childList: []
				}, ],
			}
		},
		methods: {
			toPage: function() {
				if (this.jsonData.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请先登录',
						duration: 1500
					})
				} else {
					util.openwithData('./detail', this.jsonData, {
						test1: function(data) {
							console.log(data);
						},
						test2: function(data) {
							console.log(data);
						}
					})
				}
			},
			login: function() {
				console.log('login');
				// uni.switchTab({
				// 	url: '/pages/test/index'
				// });
				if (this.uname.length <= 0 || this.passw.length <= 0) {
					uni.showToast({
						title: '账号或密码不能为空',
						icon: 'none'
					});
					return;
				} else {
					this.showLoading()
					let deviceId = util.getDeviceId();
					let broswerId = util.getBroswerId();
					let comData = {
						platform_code: this.globaData.PLATFORMCODE, //平台代码
						app_code: this.globaData.APPCODE, //应用系统代码
						unit_code: '-1', //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
						uuid: deviceId, //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
						webid: broswerId, //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
						shaketype: '1', //
					};
					console.log('response.comData:'+JSON.stringify(comData));
					this.post(this.globaData.INTERFACE_SSO_SKIN + 'login/getEncryptKey', comData, (response0,response) => {
						console.log('response:'+JSON.stringify(response));
						if (response.code === '0000') {
							let data = response.data
							let ConsultPublicKey = {
								n: String(data.Modulus),
								e: String(data.Exponent)
							}
							let rsaPublicKey = new RSAKey()
							rsaPublicKey.setPublicString(JSON.stringify(ConsultPublicKey))
							let comData = {
								uuid: deviceId, //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
								webid: broswerId, //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
								shaketype: '1', //
								login_name: rsaPublicKey.encrypt(this.uname), //登录名
								password: rsaPublicKey.encrypt(this.passw), //
								device_type: '1', //登录设备类型，0：WEB、1：APP、2：客户端
								platform_code: this.globaData.PLATFORMCODE, //平台代码
								app_code: this.globaData.APPCODE, //应用系统代码
								unit_code: '-1', //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
								verify_code: ''
							};
							this.post(this.globaData.INTERFACE_SSO_SKIN + 'login', comData,
							response => {
								console.log('login:'+JSON.stringify(response));
								this.loginInfo = response;
								//1.4获取菜单
								//不需要加密的数据
								var comData4 = {
									platform_code: this.globaData.PLATFORMCODE, //平台代码
									app_code: this.globaData.APPCODE, //应用系统代码
									unit_code: response.user.unit_code,
									index_code: 'index',
									access_token: response.access_token //用户令牌
								};
								this.post(this.globaData.INTERFACE_SSO_SKIN + 'acl/menu',
									comData4, (data1,data4) => {
										this.hideLoading()
										console.log("data4: " + JSON.stringify(data4));
										if (data4.code == 0) {
											if (data4.data.list.length > 0) {
												this.setPageMenu(data4.data.list[0].childList);
											} else {
												uni.showToast({
													icon: 'none',
													title: '应用系统无权限，请联系管理员',
													duration: 1500
												})
											}
										} else {
											uni.showToast({
												icon: 'none',
												title: data4.msg,
												duration: 1500
											})
										}
									})

							}, '正在登录...')
						} else {
							uni.showToast({
								icon: 'none',
								title: '获取秘钥失败',
								duration: 1500
							});
						}
					})
				}
			},
			gotoPage: function() {
				let tempData = this.loginInfo;
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
					// util.mOpenWithData("../../html/mine/modifyPassword.html", tempModel);
				} else {
					if (tempData.user_code == '0') { //无权限
						// util.hrefSessionStorage('../../html/login/index2.html', {});
					} else {
						// util.hrefSessionStorage('../../html/login/index.html', {});
						console.log("跳转页面吧");
						this.jsonData = tempData;
						var tempArray = util.getMenu();
						if (tempArray.length>0) {
							uni.switchTab({
								url: tempArray[0].pagePath
							});
						} else{
							uni.showToast({
								icon: 'none',
								title: '当前系统没有可用菜单',
								duration: 1500
							});
						}
					}
				}
			},
			setPageMenu: function(tempMenu) {
				var tempA = [];
				for (var i = 0; i < tempMenu.length; i++) { //一级菜单循环
					var web_first_item = tempMenu[i];
					for (var a = 0; a < this.pageArray.length; a++) {
						var local_first_item = this.pageArray[a];
						if (local_first_item.url == web_first_item.url) {
							local_first_item.text = web_first_item.name;
							local_first_item.access = web_first_item.access;
							local_first_item.redspot_url = web_first_item.redspot_url;
							let childList = []
							for (var b = 0; b < web_first_item.childList.length; b++) { //二级菜单循环
								var web_second_item = web_first_item.childList[b];
								for (var c = 0; c < local_first_item.childList.length; c++) {
									var local_second_item = local_first_item.childList[c];
									if (local_second_item.url == web_second_item.url) {
										local_second_item.access = web_second_item.access;
										local_second_item.redspot_url = web_second_item.redspot_url;
										local_second_item.childList = web_second_item.childList;
										local_second_item.text = web_second_item.name;
										childList.push(local_second_item)
									}
								}
							}
							local_first_item.childList = childList
							tempA.push(local_first_item);
						}
					}
				}
				console.log('tempA:' + JSON.stringify(tempA));
				if (tempA.length > 5) {
					var tempArrayM = tempA.slice(4);
					util.setMenuMore(tempArrayM);
					// store.set(window.storageKeyName.MOREMENU, tempArrayM);
					tempA = tempA.slice(0, 4);
					tempA.push({
						text: "更多",
						pagePath: "/pages/more/index",
						iconPath: '../../static/logo.png',
						selectedIconPath: '../../static/logo.png',
						img_href: "../../img/schapp_work/kaoqin_tab.png",
						url: 'schappUni_CoursePractice',
						childList: []
					});
				}else{
					util.setMenuMore([]);
				}
				this.showArray = [].concat(tempA);
				util.setMenu(this.showArray);
				this.gotoPage();
			}
		},
		onLoad: function() {}
	}
</script>

<style>
	/* .content {
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	} */

	.mui-checkbox input[type='checkbox']:checked:before {
		color: #00bbb1;
	}

	.RememberPass {
		color: #adadad;

		margin-top: 5px;
	}

	.RememberCheck {
		margin-left: -50%;
		margin-top: 10px;
		color: #adadad;
	}

	.content {
		text-align: center;
		height: 400upx;
	}

	.backlogo {
		padding-bottom: 0px;
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.titletal {
		margin-top: 90upx;
		height: 75px;
	}

	.title {
		/* font-size: 36upx; */
		color: mediumaquamarine;
		font-size: 150%;
	}

	.text {
		border: 1, solid, black;
	}

	.login-from {
		/* margin-top: 30%; */

		flex: auto;
		height: 100%;
		width: 100%;
	}

	.inputView {
		background-color: #fff;
		line-height: 50px;
		border-width: 1px;
		border-bottom: 2dp;
	}

	/*输入框*/
	.nameImage,
	.keyImage {
		margin-top: 15px;
		margin-left: 0px;
		width: 22px;
		height: 22px;
	}

	.loginLab {
		margin: 15px 15px 15px 10px;
		color: #545454;
		font-size: 18px;
	}

	.inputText {
		flex: block;
		float: right;
		text-align: left;
		margin-right: 22px;
		margin-top: 15px;
		color: #000000;
		font-size: 18px;
	}

	.line {
		/* width: 100%; */
		margin-left: 40px;
		margin-right: 40px;
		height: 1px;
		background-color: #cccccc;
		margin-top: 1px;
	}

	/*按钮*/
	.loginBtnView {
		width: 100%;
		height: auto;
		/* background-color:#FFFFFF; */
		margin-top: 20px;
		margin-bottom: 0px;
		padding-bottom: 0px;
	}

	.loginBtn {
		width: 80%;
		margin-top: 50px;
		background-color: mediumaquamarine;
		color: aliceblue;
	}
</style>
