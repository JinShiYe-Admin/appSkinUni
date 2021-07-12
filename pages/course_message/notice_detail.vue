<template>
	<view  style="padding: 20px 15px;">
		<uni-title class="h3" style="align-items: center;word-break: break-all;" type="h3" :title="`${itemData.name}`"></uni-title>
		<uni-title class="h5" style="align-items: center;word-break: break-all;" type="h5" :title="`发布时间：${itemData.create_time}`"></uni-title>
		<text style="word-break: break-all;" v-html="itemData.content"></text>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				itemData:{}
			}
		},
		methods: {
			
		},
		onLoad: function(option) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(option);
			uni.setNavigationBarTitle({title: '详情'})
			this.itemData=itemData
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>

</style>
