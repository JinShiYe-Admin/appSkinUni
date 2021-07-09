<template>
	<view>
		<!-- <navigation-bar :title="navTitle" background-color="#00CFBD" /> -->
		<uniNavBar :title="navTitle" left-icon="back" backgroundColor='#00CFBD' fixed='true' statusBar='true' color='white' @clickLeft='clickLeft()'></uniNavBar>
		<view style="background-color: white;height: 10px;"></view>
		<h4 style="margin-left: 20px;margin-right: 20px;text-align: center;">{{curPage.user_info}}</h4>
		<view style="background-color: white;height: 20px;"></view>
		<view class="uni-list">
			<view class="uni-list-cell" style="height: 40px;">
				<view class="uni-list-cell-left" style="width: 90px;">
					用户账号
				</view>
				<view class="uni-list-cell-db">
					<input v-if="curPage.status==0" v-model="uaccount" maxlength="20" style="height: 40px;" type="text"
						placeholder="请输入账号" />
					<input v-if="curPage.status==1" v-model="uaccount" maxlength="20" style="height: 40px;" type="text" disabled
						placeholder="请输入账号" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 90px;">
					请输入{{tempStr}}密码
				</view>
				<view class="uni-list-cell-db">
					<input v-model="upassword" password style="height: 40px;" maxlength="18" type="text" placeholder="请输入密码" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 90px;">
					请确认{{tempStr}}密码
				</view>
				<view class="uni-list-cell-db">
					<input v-model="confirmpassword" password style="height: 40px;" maxlength="18" type="text" placeholder="请确认密码" />
				</view>
			</view>
		</view>
		<view v-if="curPage.status==0" style="margin-top: 10px;">
			<view @click="clickPrivace()"
				style="float: right;margin:7px 20px 0 -10px;color: #00CFBD;text-decoration: underline;">《用户隐私政策》</view>
			<view v-if="privaceFlag == 0" @click="clickFlag(0)"
				style="float: right;margin-top: 5px;margin-right: 10px;">
				<label>
					<checkbox value="cb" />同意
				</label>
			</view>
			<view v-else-if="privaceFlag == 1" @click="clickFlag(1)"
				style="float: right;margin-top: 5px;margin-right: 10px;">
				<label>
					<checkbox value="cb" checked="true" />同意
				</label>
			</view>
		</view>
		<view style="text-align: center;margin-top: 100px;">本页面有效时间剩余：<span style=" color: red ">{{yanZMTime}}</span> 秒
		</view>
		<view style="bottom: 20px;position: fixed;width: 95%;margin: 0 2.5%;">
			<button id='idenCodebtn' @click="submit" type="button" class="mui-btn mui-btn-block mui-btn-primary"
				style="background: #00CFBD;border: 0;height: 36px;font-size: 15px;color: white;">确 定</button>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import md5 from '../../commom/encrypt/md5.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	let _this;
	export default {
		data() {
			return {
				navTitle:'',
				privaceFlag: 0,
				curPage: '',
				uaccount: '', //用户账号
				upassword: '', //用户密码
				confirmpassword: '', //确认密码
				yanZMTime: 600,
				tempStr: '',
			}
		},
		components: {
			uniNavBar
		},
		onLoad: function(option) {
			_this = this;
			this.curPage = util.getPageData(option);
			console.log('this.curPage:' + JSON.stringify(this.curPage));
			if (this.curPage.login_name) {
				this.uaccount = this.curPage.login_name;
			}
			if (this.curPage.status == 0) {
				this.navTitle = '账号注册';
			} else {
				this.navTitle = '找回密码';
				this.tempStr = '新';
			}
			var dateStart = Date.parse(new Date());
			var tempTime = dateStart - this.curPage.yanzmStart;
			let time1 = parseInt(tempTime);
			let time2 = time1 / 1000;
			let time3 = 600 - time2;
			if (time3 < 0) {
				time3 = 0;
			}
			this.yanZMTime = time3;
			setTimeout(function() {
				_this.countDown();
			}, 1000);
		},
		methods: {
			clickLeft:function(){
				let eventChannel = _this.getOpenerEventChannel();
				eventChannel.emit('refresh', {});
				uni.navigateBack();
			},
			refresh: function() {
				setTimeout(function() {
					let eventChannel = _this.getOpenerEventChannel();
					eventChannel.emit('refresh', {});
					uni.navigateBack();
				}, 1500);
			},
			clickPrivace: function() {
				console.log('clickPrivace')
				util.openwithData('/pages/more/privace');
			},
			clickFlag: function(flag) {
				if (flag == 0) {
					this.privaceFlag = 1;
				} else {
					this.privaceFlag = 0;
				}
			},
			countDown: function() {
				if (this.yanZMTime > 0) {
					this.yanZMTime = this.yanZMTime - 1;
					setTimeout(function() {
						_this.countDown()
					}, 1000);
				}
			},
			submit: function() { //提交数据
				console.log(this.utype_value)
				if (this.uaccount == '') {
					this.showToast('请输入用户账号');
				} else if (escape(this.uaccount).indexOf("%u") >= 0) {
					this.showToast('用户账号不能输入汉字');
				} else if (this.uaccount.length > 20 || this.uaccount.length < 4) {
					this.showToast('字符长度不能超过');
				} else if (this.upassword == '') {
					this.showToast('请输入用户密码');
				} else if (this.confirmpassword == '') {
					this.showToast('请确认密码');
				} else if (!(this.upassword === this.confirmpassword)) {
					this.showToast('两次输入的密码不一致');
				} else if (!checkPass(this.confirmpassword)) {
					this.showToast('密码需为数字和字母的组合');
				} else if (this.confirmpassword.length > 18 || this.confirmpassword.length < 6) {
					this.showToast('密码需为6到18位数字和字母的组合');
				} else {
					if (this.curPage.status == 0 && this.privaceFlag == 0) {
						this.showToast('请先同意隐私政策');
					} else {
						var comData0 = {
							platform_code: this.globaData.PLATFORMCODE, //平台代码
							app_code: this.globaData.APPCODE, //应用系统代码
							index_code: 'index', //页面权限符
							user_code: this.curPage.user_code, //用户代码
							user_type: '', //用户类型
							user_name: this.curPage.user_name, //姓名
							phone: this.curPage.phone, //电话
							password: md5.hex_md5(this.PWD_ENCRYPTION + this.confirmpassword), //密码,秘钥+密码再MD5加密
							msg_token: this.curPage.msg_token,
							msg: this.curPage.msg,
						};
						console.log('this.PWD_ENCRYPTION:'+this.PWD_ENCRYPTION);
						console.log('comData0:' + JSON.stringify(comData0));
						this.showLoading()
						var tempUrl = 'register';
						if (this.curPage.status == 1) {
							tempUrl = 'register/resetPwd';
							//发送网络请求，data为网络返回值
							this.post(this.globaData.INTERFACE_HR_SKIN + tempUrl, comData0, (data0, data) => {
								console.log('register:' + JSON.stringify(data));
								this.hideLoading();
								this.showToast(data.msg);
								this.refresh();
							});
						} else {
							comData0.unit_code = this.curPage.unit_code;
							comData0.login_name = this.uaccount;
							//不需要加密的数据
							var comData1 = {
								uuid: util.getDeviceId(), //设备唯一识别码,防同一应用在不同机器上登录互串,验证码校检用
								webid: util
									.getBroswerId(), //浏览器识别码,防不同浏览器登录同一应用互串,验证码校检用（web用浏览器类型加版本，app用操作系统+版本））
								shaketype: '1', //
								login_name: '00000000000', //登录名
								password: '', //
								device_type: '1', //登录设备类型，0：WEB、1：APP、2：客户端
								platform_code: this.globaData.PLATFORMCODE, //平台代码
								app_code: this.globaData.APPCODE, //应用系统代码
								unit_code: this.curPage.unit_code, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
								verify_code: ''
							};
							//登录
							this.post(this.globaData.INTERFACE_SSO_SKIN + 'login', comData1, data1 => {
								comData0.access_token = data1.access_token;
								//发送网络请求，data为网络返回值
								this.post(this.globaData.INTERFACE_HR_SKIN + tempUrl, comData0, (data0,
									data) => {
										console.log('register:' + JSON.stringify(data));
										this.hideLoading();
										if (data.code == 0) {
											this.showToast(data.msg);
											this.refresh();
										} else {
											this.showToast(data.msg);
										}
									});
							});
						}
					}
				}
			}
		}
	}
	//判断字符串是否为数字和字母组合
	function checkPass(password) {
		var re = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/g;
		if (!re.test(password)) {
			return false;
		} else {
			return true;
		}
	}
</script>

<style>

</style>
