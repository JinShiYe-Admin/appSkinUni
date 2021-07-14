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
			if(util.getTabbarMenu().url){
				this.tabBarItem = util.getTabbarMenu();
				util.setTabbarMenu({});
			}else{
				this.tabBarItem = util.getPageData(option);
			}
			console.log('this.tabBarItem:' + JSON.stringify(this.tabBarItem));
		}
	}
</script>

<style>
</style>
