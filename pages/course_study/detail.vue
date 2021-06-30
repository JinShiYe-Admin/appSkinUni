<template>
	<view>
		<view style="flex: 1;">
			<template v-if="videoData">
				<video style="width: 100%;height: 200px;" :src="videoData.url" 
				:initial-time="videoData.currTime"
				@error="videoErrorCallback" 
				@play="onPlay"  
				@pause="onPause" 
				@ended="onEnded" 
				@timeupdate="onTimeupdate"  
				:show-fullscreen-btn="false"
				:show-play-btn="true"
				:enable-progress-gesture="false"
				:show-mute-btn="true"
				:show-center-play-btn="true"
				:controls="false"></video>
			</template>
			<template v-else>
				<view style="width: 100%;height: 200px;display: flex;flex-direction: column;justify-content: center;background-color: #000000;">
					<view style="align-self: center;color: #EAEAEA;">
						请选择一个视频观看
					</view>
				</view>
			</template>
		</view>
		<view class="uni-padding-wrap">
			<view class="uni-box">
				<uni-title class="h4" type="h4" :title="itemData.sub_name"></uni-title>
				<uni-title class="h5" type="h5" :title="`课程总时长：${pageData.video_times?pageData.video_times:'0'}`"></uni-title>
				<!-- <uni-title class="h5" type="h5" :title="`已学总时长：${pageData.learn_time?pageData.learn_time:'未开始学习'}`"></uni-title> -->
				<uni-title class="h5" type="h5" :title="`本视频时长：${pageData.times?pageData.times:'请选择视频'}`"></uni-title>
			</view>
			<!-- <view>
				<progress percent="67.89" border-radius="10" activeColor="#26AAFD" backgroundColor="#E5E5E5"/>
			</view> -->
		</view>
		<view class="line-h"></view>
		<view class="uni-padding-wrap">
			<uni-section title="章节" type="line"></uni-section>
		</view>
		<view class="uni-padding-wrap">
			 <ly-tree v-if="treeLoadReady"  :tree-data="treeData" node-key="id" @node-click="handleNodeClick" :props="props" showNodeIcon
			 :default-checked-keys="checkedKeys"
			 defaultExpandAll
			 iconClass="noIcon"
			 highlightCurrent
			  ></ly-tree>
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
				treeLoadReady:false,
				props: {label: 'name',icon: 'img',},
				
				
				pageData:'',
				treeData:[],
				videoData:'',
				checkedKeys:[],
			}
		},
		methods: {
			handleNodeClick(obj) {
				console.log('handleNodeClick', JSON.stringify(obj));
				if(obj.childNodesId.length===0){//如果>0说明是父节点，不管
					this.showLoading()
					if(obj.data.url){//如果是视频，获取学习此视频的信息
						this.getVideoLearnInfo(obj.parentId,obj.data.id,obj.data)
					}else{//如果不是视频，获取目录下的视频列表
						this.getCatalogFile(obj.data.id,video_list=>{
							setTreeDataAndChecked(this,obj.data.id,'',video_list)
							this.hideLoading()
						})
					}
				}
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
						//不能删，目前的测试来看，记录的已学目录和视频id 是不正确的，都是按默认第一个最下级目录的第一个视频展示,如果记录正确，放开这一段，树形菜单可正确展示并且默认选择正在学习的视频
						// if(response.learn_book_catalog_id && response.learn_book_catalog_file_id){//如果有正在学习的视频，获取指定目录下的文件
							// this.getCatalogFile(response.learn_book_catalog_id,video_list=>{
							// 	let videoInfo={}
							// 	for (var i = 0; i < video_list.length; i++) {
							// 		if(response.learn_book_catalog_file_id===video_list[i].id){
							// 			videoInfo=video_list[i]
							// 		}
							// 	}
							// 	setTreeDataAndChecked(this,response.learn_book_catalog_id,response.learn_book_catalog_file_id,video_list)
							// 	this.getVideoLearnInfo(response.learn_book_catalog_id,response.learn_book_catalog_file_id,videoInfo)
							// })
							//如果已学视频和目录id正确的话，使用以上代码，可以将树形菜单正确显示，
						// }else{//获取第一个最下级目录下的文件
							const lastObj=getArrayLayer(response.book_catalog_list,'children')
							this.getCatalogFile(lastObj.id,video_list=>{
								let videoInfo=video_list[0]
								setTreeDataAndChecked(this,lastObj.id,videoInfo.id,video_list)
								this.getVideoLearnInfo(lastObj.id,videoInfo.id,videoInfo)
							})
						// }
					}
					let timeStr=''
					if(((''+response.video_times/60/60).split(".")[0])>0){
						timeStr+=(''+response.video_times/60/60).split(".")[0]+' 小时 '
					}
					timeStr+=(''+response.video_times/60).split(".")[0]+' 分钟 '+response.video_times%60+' 秒'
					response.video_times=timeStr
					this.pageData=response
				})
			},
			getCatalogFile(book_catalog_id,callback){
				const comData={
					book_catalog_id:book_catalog_id,
					index_code:"CourseStudy:Index",
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/getCatalogFile',comData,response=>{
					console.log("respons: " + JSON.stringify(response));
					if(response.video_list.length>0){
						response.video_list.map(item=>{item.img='../../static/video.png'})
						callback(response.video_list)
					}else{
						this.hideLoading()
					}
				})
			},
			getVideoLearnInfo(book_catalog_id,book_catalog_file_id,videoInfo){
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
					console.log("responsea: " + JSON.stringify(response));
					videoInfo.currTime=response.curr_time
					this.videoData.currTime=videoInfo
					let timeStr=''
					if(((''+response.times/60/60).split(".")[0])>0){
						timeStr+=(''+response.times/60/60).split(".")[0]+' 小时 '
					}
					timeStr+=(''+response.times/60).split(".")[0]+' 分钟 '+response.times%60+' 秒'
					this.pageData.times=timeStr
					this.hideLoading()
				})
			},
			videoErrorCallback(e){
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			onPlay(e){
				  console.log("onPlay:" + JSON.stringify(e));
			},
			onPause(e){
				  console.log("onPause:" + JSON.stringify(e));
			},
			onEnded(e){
				  console.log("onEnded:" + JSON.stringify(e));
			},
			onTimeupdate(e){
				  console.log("onTimeupdate:" + JSON.stringify(e.detail));
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
	//获取多维数组第一个最下级目录的第一个节点对象
	function getArrayLayer(arr, attr) {
	  let obj={};
	  if(arr[0][attr]){
		  obj=getArrayLayer(arr[0][attr],attr)
	  }else{
		  obj=arr[0]
	  }
	  return obj
	}
	//将获取到的目录数组设置到tree中 并设置选中状态 book_catalog_file_id 不传代表不选中
	function setTreeDataAndChecked(that,book_catalog_id,book_catalog_file_id,video_list){
		getTreeData(that.treeData,book_catalog_id,video_list,()=>{
			//更新树
			that.treeData=[].concat(that.treeData)
			//设置选择状态
			if(book_catalog_file_id){
				that.checkedKeys=[book_catalog_file_id]
			}
		})
	}
	function getTreeData(arr,book_catalog_id,video_list,callback){
		for (const iterator of arr) {
			if(iterator['children']){
			    getTreeData(iterator['children'],book_catalog_id,video_list,callback)
			}else{
				if(book_catalog_id===iterator.id){
					iterator.children=video_list
					callback()
					return 0
				}
			}
		}
	}
</script>

<style>
	.noIcon{
		display: none;
	}
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
