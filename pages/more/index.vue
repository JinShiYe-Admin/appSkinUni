<template>
	<view>
		<u-navbar title="ddd" backFlag='2' :backImg="navBarLeftImg" :background="background"
			:custom-back="clickLeftImg"></u-navbar>
		<uni-drawer ref="showPersonInfo" mode="left" width="280">
			<scroll-view style="height: 100%;" scroll-y="true">
				<image :src="personInfo.img_url"
					style="width: 150px;height: 150px;border-radius: 50%;margin-top: 50px;margin-left: 65px;"></image>
				<view style="text-align: center;margin-top: 10px;">{{personInfo.user_name}}</view>

				<uni-list style="margin-top: 20px;">
					<uni-list-item title="修改头像" link to=''></uni-list-item>
					<uni-list-item title="修改密码" link to=''></uni-list-item>
				</uni-list>
				<view class="uni-padding-wrap uni-common-mt">
					<button type="warn">退出登录</button>
				</view>
				<!-- <button @click="closeDrawer" type="primary">关闭Drawer</button>
				<view v-for="item in 60" :key="item">可滚动内容 {{ item }}</view> -->
			</scroll-view>
		</uni-drawer>
		<view class="tabs">
			<uni-easyinput suffixIcon="arrowdown" v-model="value" placeholder="请输入内容" @iconClick="iconClick">
			</uni-easyinput>
			<uni-easyinput suffixIcon="arrowdown" v-model="value" placeholder="请输入内容" @iconClick="iconClick">
			</uni-easyinput>
			<uni-easyinput suffixIcon="arrowdown" v-model="value" placeholder="请输入内容" @iconClick="iconClick">
			</uni-easyinput>
		</view>
		<u-tabbar :list="tabbar"></u-tabbar>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return {
				personInfo: {},
				value: '',
				navBarLeftImg: '',
				tabbar: []
			}
		},
		methods: {
			clickLeftImg() {
				this.$refs.showPersonInfo.open();
			},
			closeDrawer() {
				this.$refs.showPersonInfo.close();
			}
		},
		onLoad(option) {
			console.log('BBBoption:'+JSON.stringify(option));
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			this.navBarLeftImg = this.personInfo.img_url;
			console.log('personInfo:' + JSON.stringify(this.personInfo));
			let tempAAA = util.getMenuMore();
			console.log('tempAAA:' + JSON.stringify(tempAAA));
			console.log('tempAAA.le:'+tempAAA.length);
			let tempMenu;
			if (util.getMenuMore().length==0) {
				tempMenu = util.getTabbarMenu();
			} else{
				tempMenu = util.getPageData(option);
			}
			console.log('tempMenu:' + JSON.stringify(tempMenu));
		}
	}
</script>

<style>
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #EEF0F2;
	}

	.tabs {
		display: flex;
		flex-direction: row;
		overflow: hidden;
		background-color: #FFFFFF;
		padding: 3px;
	}

	.flex-box {
		flex: 1;
	}
</style>
