<template>
	<view>
		<view style="flex: 1;">
			<video style="width: 100%;height: 200px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni-app-doc/3c1782e0-60ab-11eb-8ff1-d5dcf8779628.m4v" @error="videoErrorCallback" :controls="false"></video>
		</view>
		<view class="uni-padding-wrap">
			<view class="uni-box">
				<uni-title class="h4" type="h4" :title="itemData.sub_name"></uni-title>
				<uni-title class="h5" type="h5" :title="`课程总时长：${pageData.video_times?pageData.video_times:'0'}`"></uni-title>
				<uni-title class="h5" type="h5" :title="`已学总时长：${pageData.learn_time?pageData.learn_time:'未开始学习'}`"></uni-title>
				<uni-title class="h5" type="h5" :title="`本视频时长：${pageData.times?pageData.times:'请选择视频'}`"></uni-title>
			</view>
			<view>
				<progress percent="67.89" border-radius="10" activeColor="#26AAFD" backgroundColor="#E5E5E5"/>
			</view>
		</view>
		<view class="line-h"></view>
		<view class="uni-padding-wrap">
			<uni-section title="章节" type="line"></uni-section>
		</view>
		<view class="uni-padding-wrap">
			 <ly-tree v-if="treeLoadReady" toggleExpendAll :tree-data="treeData" node-key="id" @node-click="handleNodeClick" :props="props" showNodeIcon ></ly-tree>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	const personal =util.getPersonal()
	export default {
		data() {
			return {
				itemData:'',
				pageData:'',
				treeLoadReady:false,
				treeData:[],
				props: {label: 'name',icon: 'img',},
				videoInfo:'',
			}
		},
		methods: {
			handleNodeClick(obj) {
				console.log('handleNodeClick', JSON.stringify(obj));
			},
			getDetailById(itemData){
				this.showLoading()
				const comData={
					stu_code:personal.user_code,
					sub_code:itemData.sub_code,
					sys_grd_code:itemData.sys_grd_code,
					term_code:itemData.term_code,
					book_id:itemData.book_id,
					index_code:"CourseStudy:Index",
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/detail',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					if(response.book_catalog_list){
						response.book_catalog_list.map(item=>{item.img=''})
						this.treeData=response.book_catalog_list
					}
					if(response.learn_book_catalog_id && response.learn_book_catalog_file_id){
						this.getCatalogFile(response.learn_book_catalog_id,response.learn_book_catalog_file_id)
					}
					this.pageData=response
					console.log("this.pageData: " + JSON.stringify(this.pageData));
				})
			},
			getCatalogFile(book_catalog_id,book_catalog_file_id){
				const comData={
					book_catalog_id:book_catalog_id,
					index_code:"CourseStudy:Index",
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/getCatalogFile',comData,response=>{
					console.log("responseaaaaaaaaaaaaaaaaaaaaaa: " + JSON.stringify(response));
					this.setTreeData(response.video_list)
					this.getVideoLearnInfo(book_catalog_id,book_catalog_file_id)
				})
			},
			getVideoLearnInfo(book_catalog_id,book_catalog_file_id){
				const comData={
					term_code:this.itemData.term_code,
					term_name:this.itemData.term_name,
					book_id:this.itemData.book_id,
					book_catalog_id:book_catalog_id,
					book_catalog_file_id:book_catalog_file_id,
					stu_code:personal.user_code,
					index_code:"CourseStudy:Index",
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/getVideoLearnInfo',comData,response=>{
					console.log("responsebbbbbbbbbbbbbbbbbbbbbbbbb: " + JSON.stringify(response));
					this.hideLoading()
				})
			},
			setTreeData(video_list){
				
			}
		},
		onLoad: function(option) {
			uni.setNavigationBarTitle({title: "详情"})
			const itemData = util.getPageData(option);
			this.treeLoadReady=true
			this.itemData=itemData
			this.getDetailById(itemData)
		}
	}
</script>

<style>
	.line-h{
		margin-top: 10px;
		height: 5px;
		background-color: #EEF0F2;
	}
	
	.line-w{
		margin-top: 10px;
		width: 5px;
		background-color: #EEF0F2;
	}
</style>
