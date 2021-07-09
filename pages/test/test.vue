<template>
	<view>
		<mynavBar :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<u-tabbar-my :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
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
