<template>
	<view class="content">
		课程学习
		<u-tabbar :list="tabbar" ></u-tabbar>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	export default {
		data() {
			return {
				tabbar: []
			}
		},
		onLoad() {
			this.tabbar = util.getMenu();
			console.log('this.tabbar:'+JSON.stringify(this.tabbar));
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>