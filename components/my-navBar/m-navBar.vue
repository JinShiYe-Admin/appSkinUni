<template>
	<view>
		<u-navbar :title='navItem.text' :backFlag='navItem.index' :backImg="personInfo.img_url" :custom-back="clickLeftImg"></u-navbar>
		<uni-drawer ref="showPersonInfo" mode="left">
			<scroll-view style="height: 100%;" scroll-y="true">
				<view style="text-align: center;">
					<image :src="personInfo.img_url"
						style="width: 100px;height: 100px;border-radius: 50%;margin-top: 50px;"></image>
				</view>
				<view style="text-align: center;margin-top: 10px;">{{personInfo.user_name}}</view>
				<view style="height: 15px;background-color: #DCDFE6;margin-top: 30px;"></view>
				<uni-list>
					<uni-list-item @click="gotoModifyPswd()" title="修改密码" link to=''></uni-list-item>
					<uni-list-item @click="zhuxiao()" title="注销账号" link to=''></uni-list-item>
					<uni-list-item @click="yinsi()" title="用户隐私政策" link to=''></uni-list-item>
					<uni-list-item @click="about()" title="关于" link to=''></uni-list-item>
				</uni-list>
				<view class="uni-padding-wrap uni-common-mt">
					<button @click="tuichu()" type="warn">退出登录</button>
				</view>
			</scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		props:{
			personInfo:{
				type:Object,
				default () {
					return {
						img_url:'',
						user_name:''
					}
				}
			},
			navItem:{
				type:Object,
				default () {
					return {
						text:'',
						index:1
					}
				}
			}
		},
		methods: {
			clickLeftImg() {
				if(this.navItem.index == 0){
					this.$refs.showPersonInfo.open();
				}
			},
			closeDrawer() {
				this.$refs.showPersonInfo.close();
			},
			gotoModifyPswd:function(){
				this.$refs.showPersonInfo.close();
				util.openwithData('/pages/more/modifyPswd');
			},
			zhuxiao:function(){
				this.$refs.showPersonInfo.close();
				// util.openwithData('/pages/more/modifyPswd');
			},
			yinsi:function(){
				this.$refs.showPersonInfo.close();
				util.openwithData('/pages/more/privace');
			},
			about:function(){
				this.$refs.showPersonInfo.close();
				util.openwithData('/pages/more/about');
			},
			tuichu(){
				var personal = util.getPersonal();
				if(personal){//多次点击按钮，personal为null
					console.log("personal: " + JSON.stringify(personal));
					var comData0 = {
						platform_code: personal.platform_code, //平台代码
						app_code: personal.app_code, //应用系统代码
						unit_code: personal.unit_code, //单位代码，如应用系统需限制本单位用户才允许登录，则传入单位代码，否则传“-1”
						index_code:'index',
						access_token: personal.access_token
					};
					this.showLoading()
					//发送网络请求，data为网络返回值
					this.post(this.globaData.INTERFACE_SSO_SKIN + 'session/removeSession', comData0, data => {
						this.hideLoading();
						util.setPersonal({});
						this.$refs.showPersonInfo.close();
						uni.reLaunch({
						    url:'/pages/login/login'
						});
					});
				}
			}
		}
	}
</script>

<style>
</style>
