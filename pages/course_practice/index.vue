<template>
	<view class="content">
		课程练习
		<u-tabbar :list="tabbar"></u-tabbar>
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