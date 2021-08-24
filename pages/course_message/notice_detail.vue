<template>
	<view >
		<view  style="padding: 5px 20px;">
			<uni-title class="h3" style="align-items: center;word-break: break-all;" type="h3" :title="`${itemData.title}`"></uni-title>
			<uni-title class="h5" style="align-items: center;word-break: break-all;" type="h5" :title="`发布时间：${itemData.create_time}`"></uni-title>
		</view>
		<view class="line"></view>
		<view  style="padding:15px 15px 10px;">
			<text style="word-break: break-all;font-size: 13px;" v-html="itemData.content"></text>
		</view>
		<view  style="padding:15px 15px 40px;">
			<view :key="index" v-for="(file,index) in itemData.file_list" style="margin-top: 15px;font-size: 13px;word-break: break-all;">
				<!-- #ifdef APP-PLUS -->
				<a class="" style="font-size: 13px;color: #00CFBD;margin-left: 10px;" @click="checkEnc(file.url)">{{file.name}}</a>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<uni-link :href="file.url" :text="file.name" :download="file.name" color="#00CFBD"></uni-link>
				<!-- #endif -->
			</view>
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
			checkEnc: function(tempUrl) {
				this.showLoading()
				let that=this
				console.log('tempUrl:' + tempUrl);
				var urlStr = encodeURI(tempUrl);
				uni.downloadFile({
				  url: urlStr,
				  success: function (res) {
				    var filePath = res.tempFilePath;
				    uni.openDocument({
				      filePath: filePath,
				      success: function (res) {
						  that.hideLoading()
				        console.log('打开文档成功');
				      },
					  fail() {
						  that.hideLoading()
					  	uni.showToast({
					  		title:'当前附件打开失败'
					  	})
					  }
				    });
				  }
				});
			},
		},
		onLoad: function(option) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(option);
			console.log("itemData: " + JSON.stringify(itemData));
			uni.setNavigationBarTitle({title: '详情'})
			this.itemData=itemData
			//#ifndef APP-PLUS
				document.title=""
				var isPageHide = false;
				window.addEventListener('pageshow', function() {
					if (isPageHide) {
						window.location.reload();
					}
				});
				window.addEventListener('pagehide', function() {
					isPageHide = true;
				});
			//#endif
		},
		onUnload() {
		}
	}
</script>

<style>
.line{
	width: 100vw;
	height: 1px;
	background-color: #00CFBD;
}
</style>
