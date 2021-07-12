<template>
	<view >
		<view  style="padding: 5px 20px;">
			<uni-title class="h3" style="align-items: center;word-break: break-all;" type="h3" :title="`${itemData.title}`"></uni-title>
			<uni-title class="h5" style="align-items: center;word-break: break-all;" type="h5" :title="`发布时间：${itemData.create_time}`"></uni-title>
		</view>
		<view class="line"></view>
		<view  style="padding:15px 15px 20px;">
			<text style="word-break: break-all;font-size: 13px;" v-html="itemData.content"></text>
		</view>
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
			console.log("itemData: " + JSON.stringify(itemData));
			uni.setNavigationBarTitle({title: '详情'})
			this.itemData=itemData
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>
.line{
	width: 100vw;
	height: 1px;
	background-color: #00CFBD;
}
</style>
