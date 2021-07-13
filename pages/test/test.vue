<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<u-tabbar-my :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {}
			}
		},
		components: {
			mynavBar
		},
		methods: {
			
		},
		onLoad(option) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			})
			console.log('BBBoption:' + JSON.stringify(option));
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			console.log('personInfo:' + JSON.stringify(this.personInfo));
			let tempMenu;
			if (util.getMenuMore().length == 0) {
				tempMenu = util.getTabbarMenu();
			} else {
				tempMenu = util.getPageData(option);
			}
			this.tabBarItem = tempMenu;
			console.log('tempMenu:' + JSON.stringify(tempMenu));
		}
	}
</script>

<style>
</style>
