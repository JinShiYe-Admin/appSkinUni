<template>
	<view>
		<u-navbar :title='tabBarItem.text' :backFlag='tabBarItem.index' :backImg="navBarLeftImg" :custom-back="clickLeftImg"></u-navbar>
		<uni-drawer ref="showPersonInfo" mode="left">
			<scroll-view style="height: 100%;" scroll-y="true">
				<view style="text-align: center;">
					<image :src="personInfo.img_url"
						style="width: 150px;height: 150px;border-radius: 50%;margin-top: 50px;"></image>
				</view>
				<view style="text-align: center;margin-top: 10px;">{{personInfo.user_name}}</view>
				<uni-list style="margin-top: 20px;">
					<uni-list-item title="修改头像" link to=''></uni-list-item>
					<uni-list-item title="修改密码" link to=''></uni-list-item>
				</uni-list>
				<view class="uni-padding-wrap uni-common-mt">
					<button type="warn">退出登录</button>
				</view>
			</scroll-view>
		</uni-drawer>
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
				tabbar: [],
				tabBarItem:{}
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
			let tempMenu;
			if (util.getMenuMore().length==0) {
				tempMenu = util.getTabbarMenu();
			} else{
				tempMenu = util.getPageData(option);
			}
			this.tabBarItem = tempMenu;
			console.log('tempMenu:' + JSON.stringify(tempMenu));
		}
	}
</script>

<style>
</style>
