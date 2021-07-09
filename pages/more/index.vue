<template>
	<view>
		<u-tabbar-my :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
			}
		},
		methods: {
			
		},
		onLoad(option) {
			console.log('BBBoption:' + JSON.stringify(option));
			this.tabbar = util.getMenu();
		}
	}
</script>

<style>
</style>
