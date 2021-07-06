<template>
	<view>
		<u-tabbar :list="tabbar"></u-tabbar>
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
