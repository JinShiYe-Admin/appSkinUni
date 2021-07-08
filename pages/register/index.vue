<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 80px;">
					用户姓名
				</view>
				<view class="uni-list-cell-db">
					<input :disabled="disabledFlag==0?false:true" v-model="userName" style="height: 50px;"
						maxlength="10" type="text" placeholder="请输入姓名" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 80px;">
					用户电话
				</view>
				<view class="uni-list-cell-db">
					<input :disabled="disabledFlag==0?false:true" v-model="userPhone" style="height: 50px;"
						type="number" maxlength="11" placeholder="请输入电话" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left" style="width: 80px;">
					短信验证码
				</view>
				<view class="uni-list-cell-db">
					<input :disabled="disabledFlag==2?true:false" v-model="yanzm"
						style="height: 50px;float: left;width: 120px;" type="number" maxlength="6"
						placeholder="请输入验证码" />
					<button v-if="yanZMTime==60" :disabled="disabledFlag==2?true:false" @click="getYanzm"
						style="float: left;height: 36px;font-size: 15px;margin-top: 7px;" :class="disabledFlag==2?'btnDis1':'btnDis0'"
						class="mini-btn">获取验证码</button>
					<button v-if="yanZMTime<60" :disabled="yanZMTime<60?true:false" style="float: left;height: 36px;font-size: 15px;margin-top: 7px;" class="mini-btn" >{{yanZMTime}}秒后重新获取</button>
					<!-- <button v-if="yanZMTime==60" @click='sendYanzm()' :disabled="yanZMTime<60||disabledFlag==2?true:false" :class="yanZMTime<60||disabledFlag==2?'btnDis0':'btnDis1'" style="border-color: white;margin-right: 10px;width: 100px;margin-top: 1px;">获取验证码</button>
					<button v-if="yanZMTime<60" :disabled="yanZMTime<60||disabledFlag==2?true:false" :class="yanZMTime<60||disabledFlag==2?'btnDis0':'btnDis1'" style="border-color: white;margin-right: 10px;width: 130px;margin-top: 1px;">{{yanZMTime}}秒后重新获取</button> -->
				</view>
			</view>
		</view>
		<view class="button-sp-area" style="text-align: center;margin-top: 20px;">
			<button v-if="disabledFlag==1" :disabled="disabledFlag==1?false:true" @click="searchInfo" class="btnDis0"
				size="mini">查询</button>
			<button v-if="disabledFlag!=1" :disabled="disabledFlag==1?false:true" @click="searchInfo"
				size="mini">查询</button>
			<button @click="clearInput" style="background: #00CFBD;margin-left: 20px;color: white;" class="mini-btn"
				size="mini">清空</button>
		</view>
		<view style="margin-top: 10px;" class="uni-list" v-for="(item, index) in userList" :key="item.id">
			<view class="uni-list-cell">
				<view class="uni-list-cell-pd" style="width: 60%;">
					{{item.user_info}}
				</view>
				<view class="uni-list-cell-db" style="width: 40%;">
					<button v-if="item.status==0" @click="tapItem(item)"
						style="background: #00CFBD;margin-left: 20px;color: white;" class="mini-btn"
						size="mini">注册</button>
					<button v-if="item.status==1" @click="tapItem(item)"
						style="background: #00CFBD;margin-left: 20px;color: white;" class="mini-btn"
						size="mini">找回密码</button>
					<p v-if="item.status==2" class="mui-pull-right" style="color: red;margin-top: 5px;">账号已停用</p>
					<p v-if="item.status==3" class="mui-pull-right" style="color: red;margin-top: 5px;">账号已屏蔽</p>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	let _this;
	export default {
		data() {
			return {
				utype: '',
				utype_index: 0,
				utypeArray: [],
				userName: '',
				userPhone: '',
				disabledFlag: 0, //
				yanzm: '', //
				yanZMTime: 60, //
				msg_token: '',
				clearFlag: 0,
				userList: [],
				yanzmStart: '',
			}
		},

		onLoad: function() {
			_this = this;
			util.setPersonal({});
			// this.getUserType();
		},
		methods: {
			clearInput: function() {
				this.utype_index = 0;
				this.userName = '';
				this.userPhone = '';
				this.yanzm = '';
				this.disabledFlag = 0; //
				this.yanzm = ''; //
				this.yanZMTime = 60; //
				this.msg_token = '';
				this.clearFlag = 1;
				this.userList = [];
				this.yanzmStart = '';
			},
			searchInfo: function() {
				console.log('searchInfo');
				if (this.yanzm.length != 6) {
					this.showToast('请输入正确的验证码');
				} else {
					var comData0 = {
						platform_code: this.globaData.PLATFORMCODE, //平台代码
						app_code: this.globaData.APPCODE, //应用系统代码
						user_type: '', //用户类型
						user_name: this.userName, //姓名，注册老师的时候输入老师的姓名，注册学生和家长时输入学生姓名
						phone: this.userPhone, //电话，注册老师的时候输入老师的姓名，注册学生和家长时输入家长电话
						msg_token: this.msg_token, //短信验证授权码
						msg: this.yanzm, //短信验证码
					}
					this.showLoading()
					//发送网络请求，data为网络返回值
					this.post(this.globaData.INTERFACE_HR_SKIN + 'register/userInfo', comData0, (data0, data) => {
						console.log('register/userInfo:' + JSON.stringify(data));
						this.hideLoading();
						if (data.code == 0) {
							this.yanZMTime = 60;
							this.disabledFlag = 2;
							this.clearFlag = 1;
							this.userList = data.data.list;
						} else {
							this.disabledFlag = 1;
							this.showToast(data.msg);
						}
					});
				}
			},
			getYanzm: function() {
				console.log('getYanzm');
				if (this.userName == '') {
					this.showToast('请输入用户姓名');
				} else if (this.userPhone == '') {
					this.showToast('请输入用户电话');
				} else if (!isPhone(this.userPhone)) {
					this.showToast('请输入正确的用户电话');
				} else {
					var comData0 = {
						platform_code: this.globaData.PLATFORMCODE, //平台代码
						app_code: this.globaData.APPCODE, //应用系统代码
						user_type: '', //
						user_name: this.userName, //姓名，注册老师的时候输入老师的姓名，注册学生和家长时输入学生姓名
						phone: this.userPhone //电话，注册老师的时候输入老师的姓名，注册学生和家长时输入家长电话
					};
					this.showLoading()
					//发送网络请求，data为网络返回值
					this.post(this.globaData.INTERFACE_HR_SKIN + 'register/sendMsg', comData0, (data0, data) => {
						console.log('register/sendMsg:' + JSON.stringify(data));
						this.hideLoading();
						if (data.code == 0) {
							this.msg_token = data.data.msg_token;
							this.disabledFlag = 1;
							this.clearFlag = 0;
							this.yanzmStart = Date.parse(new Date());
							this.countDown();
						} else {
							this.disabledFlag = 0;
							this.showToast(data.msg);
						}
					});
				}
			},
			countDown() {
				if (this.clearFlag == 0) {
					if (this.yanZMTime <= 1) {
						this.yanZMTime = 60;
					} else {
						this.yanZMTime = this.yanZMTime - 1;
						setTimeout(function() {
							_this.countDown();
						}, 1000);
					}
				}
			},
			tapItem: function(item) {
				console.log('item:' + JSON.stringify(item));
				item.msg = this.yanzm;
				item.msg_token = this.msg_token;
				item.yanzmStart = this.yanzmStart;
				util.openwithData('/pages/register/index1',item,{
					refresh(){
						_this.clearInput();
					}
				});
			},
		}
	}

	var isPhone = function(phone) {
		var phoneReg = /^1[3|4|5|6|7|8|9]\d{9}$/;
		if (phoneReg.test(phone)) {
			return true;
		} else {
			return false;
		}
	}
</script>

<style>
	.btnDis0 {
		background: #00CFBD;
		color: white;
	}
	.btnDis1 {
		/* background: #00CFBD; */
		color: black;
	}
</style>
