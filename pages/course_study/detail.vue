<template>
	<view>
		<view style="flex: 1;">
			<template v-if="videoData">
				<video id="myVideo" style="width: 100%;height: 200px;" :src="videoData.url" 
					:initial-time="videoData.curr_time"
					@error="videoErrorCallback" 
					@play="onPlay"  
					@timeupdate="onTimeupdate"
					@pause="onPause" 
					@ended="onEnded"
					@waiting="onWaiting"
					:show-fullscreen-btn="true"
					:show-play-btn="true"
					:enable-progress-gesture="false"
					:show-mute-btn="true"
					:show-center-play-btn="true"
					:controls="true"> 
					<!-- @ended="onEnded"  播放结束时，end和pause会同时触发，看上去end好像没有必要存在了-->
				</video>
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
				<uni-title class="h5" type="h5" :title="`课程总时长：${pageData.video_timesStr?pageData.video_timesStr:'0'}`"></uni-title>
				<uni-title v-if="!itemData.ex_score" class="h5" type="h5" :title="`已学总时长：${pageData.learn_timeStr?pageData.learn_timeStr:'未开始学习'}`"></uni-title>
			</view>
			<view v-if="!itemData.ex_score">
				<progress :percent="pageData.percent" border-radius="10" activeColor="#26AAFD" backgroundColor="#E5E5E5"/>
			</view>
			<uni-title class="h5" type="h5" :title="`本视频时长：${pageData.timesStr?pageData.timesStr:'请选择视频'}`"></uni-title>
			<uni-title v-if="!itemData.ex_score" class="h5" type="h5" :title="`本视频已学时长：${pageData.video_learn_timeStr?pageData.video_learn_timeStr:'未开始学习'}`"></uni-title>
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
				treeLoadReady:false,
				props: {label: 'name',icon: 'img',},
				
				itemData:'',//列表项带过来的数据
				pageData:'',//详情数据
				treeData:[],//树形菜单
				videoData:'',//点击树形菜单获取的视频信息
				checkedKeys:[],//选中的树形菜单节点
				times:'',//页面计时器对象
				timesPlay:'',//页面计时器对象
			}
		},
		methods: {
			handleNodeClick(obj) {
				console.log('handleNodeClick', JSON.stringify(obj));
				if(obj.childNodesId.length===0){//如果>0说明是父节点，不管
					this.showLoading()
					if(obj.data.url){//如果是视频，获取学习此视频的信息
						this.clearIntervals()
						this.videoData.play_time=Math.round(this.videoData.curr_time-this.videoData.after_time)
						this.videoData.after_time=this.videoData.curr_time
						this.updateCurrentTime();
						this.getVideoLearnInfo(obj.parentId,obj.data.id,obj.data)
					}else{//如果不是视频，获取目录下的视频列表
						this.getCatalogFile(obj.data.id,video_list=>{
							console.log("video_list: " + JSON.stringify(video_list));
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
					index_code:this.itemData.index_code,
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
							if(response.book_catalog_list.length>0){
								const lastObj=getArrayLayer(response.book_catalog_list,'children')
								this.getCatalogFile(lastObj.id,video_list=>{
									let videoInfo=video_list[0]
									setTreeDataAndChecked(this,lastObj.id,videoInfo.id,video_list)
									this.getVideoLearnInfo(lastObj.id,videoInfo.id,videoInfo)
								})
							}else{
								this.hideLoading()
							}
						// }
					}
					let timeStr=''
					if(((''+response.video_times/60/60).split(".")[0])>0){
						timeStr+=(''+response.video_times/60/60).split(".")[0]+' 小时 '
					}
					timeStr+=(''+response.video_times/60).split(".")[0]+' 分钟 '+response.video_times%60+' 秒'
					
					let ltimeStr=''
					if(((''+response.learn_time/60/60).split(".")[0])>0){
						ltimeStr+=(''+response.learn_time/60/60).split(".")[0]+' 小时 '
					}
					ltimeStr+=(''+response.learn_time/60).split(".")[0]+' 分钟 '+response.learn_time%60+' 秒'
					response.video_timesStr=timeStr
					response.learn_timeStr=ltimeStr
					response.percent=0
					if(response.video_times>0){
						response.percent=(response.learn_time/response.video_times)*100
					}
					this.pageData=response
				})
			},
			getCatalogFile(book_catalog_id,callback){
				const comData={
					book_catalog_id:book_catalog_id,
					index_code:this.itemData.index_code,
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
					index_code:this.itemData.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/getVideoLearnInfo',comData,response=>{
					console.log("responsea: " + JSON.stringify(response));
					videoInfo.curr_time=response.curr_time
					this.videoData=videoInfo
					let timeStr='' 
					if(((''+response.times/60/60).split(".")[0])>0){
						timeStr+=(''+response.times/60/60).split(".")[0]+' 小时 '
					}
					timeStr+=(''+response.times/60).split(".")[0]+' 分钟 '+response.times%60+' 秒'
					let video_learn_timeStr=''
					if(((''+response.learn_time/60/60).split(".")[0])>0){
						video_learn_timeStr+=(''+response.learn_time/60/60).split(".")[0]+' 小时 '
					}
					video_learn_timeStr+=(''+response.learn_time/60).split(".")[0]+' 分钟 '+response.learn_time%60+' 秒'
					this.pageData.timesStr=timeStr
					this.pageData.learnInfo=response
					this.pageData.video_learn_timeStr=video_learn_timeStr
					
					this.videoData.after_time=response.curr_time
					this.videoData.log_id=null
					this.hideLoading()
				})
			},
			videoErrorCallback(e){
				 this.showToast("视频播放异常")
			},
			onPlay(e){
				 console.log("onPlay:");
				 this.setInterval()
			},
			onPause(e){
				  console.log("onPause:" + JSON.stringify(e));
				   //暂停计时并更新时间
				   this.clearIntervals()
				   this.videoData.play_time=Math.round(this.videoData.curr_time-this.videoData.after_time)
				   this.videoData.after_time=this.videoData.curr_time
				   this.updateCurrentTime();
			},
			onEnded(e){
				 console.log("onEnded:" + JSON.stringify(e));
				//#ifdef APP-PLUS
				//暂停计时并更新时间
				this.clearIntervals()
				this.videoData.play_time=Math.round(this.videoData.curr_time-this.videoData.after_time)
				this.videoData.after_time=this.videoData.curr_time
				this.updateCurrentTime();
				//#endif
			},
			onWaiting(e){
				console.log("onWaiting:" + JSON.stringify(e));
				// this.videoContext.pause();
				this.setInterval()
				this.videoData.play_time=Math.round(this.videoData.curr_time-this.videoData.after_time)
				this.videoData.after_time=this.videoData.curr_time
				this.updateCurrentTime();
			},
			onTimeupdate(e){
				console.log("e.detail.currentTime: " + e.detail.currentTime);
				this.videoData.curr_time=e.detail.currentTime
				this.videoData.play_time=Math.round(e.detail.currentTime-this.videoData.after_time)
			},
			updateCurrentTime(){
				if(!this.pageData.learnInfo.pass){
					let curr_time=Math.round(this.videoData.curr_time)
					let play_time=this.videoData.play_time
					if(play_time>0){//播放时间有效才请求
						const comData={
							per_code:this.pageData.learnInfo.per_code,
							coll_code:this.pageData.learnInfo.coll_code,
							major_code:this.pageData.learnInfo.major_code,
							sys_grd_code:this.pageData.learnInfo.sys_grd_code,
							term_code:this.itemData.term_code,
							sub_code:this.itemData.sub_code,
							stu_code:personal.user_code,
							stu_catalog_file_id:this.pageData.learnInfo.id,
							start_time:this.moment().format('YYYY-MM-DD HH:mm:ss'),
							current_time:curr_time,
							play_time:play_time,
							index_code:this.itemData.index_code,
						}
						if(this.videoData.log_id){
							comData.log_id=this.videoData.log_id
						}
						console.log(JSON.stringify(comData))
						this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/updateCurrentTime',comData,response=>{
							console.log("responsea: " + JSON.stringify(response));
							this.videoData.after_time=this.videoData.curr_time
							if(response.log_id){
								this.videoData.log_id=response.log_id
							}
						},()=>{
							this.clearIntervals()
						})
					}
				}
			},
			setInterval(){//更新视频进度计时器
				if(this.times){
					this.clearIntervals()
				}
				this.times=setInterval(()=>{
					this.updateCurrentTime();
				},15000)
			},  
			clearIntervals(){
				clearInterval(this.times)
				this.times=null
			},
		},
		onLoad: function(option) {
			uni.setNavigationBarTitle({title: "详情"})
			const itemData = util.getPageData(option);
			console.log("itemData: " + JSON.stringify(itemData));
			this.treeLoadReady=true
			this.itemData=itemData
			this.getDetailById(itemData)
		},
		onReady: function(res) {
		        // #ifndef MP-ALIPAY
		        this.videoContext = uni.createVideoContext('myVideo',this)
		        // #endif
		},
		onUnload:function(){
			if(!this.pageData.learnInfo.pass){
				let curr_time=Math.round(this.videoData.curr_time)
				let play_time=this.videoData.play_time
				console.log("播放时长实际上是这样的: ",after_time,curr_time,play_time);
				if(play_time>0){//播放时间有效才请求
					const comData={
						per_code:this.pageData.learnInfo.per_code,
						coll_code:this.pageData.learnInfo.coll_code,
						major_code:this.pageData.learnInfo.major_code,
						sys_grd_code:this.pageData.learnInfo.sys_grd_code,
						term_code:this.itemData.term_code,
						sub_code:this.itemData.sub_code,
						stu_code:personal.user_code,
						stu_catalog_file_id:this.pageData.learnInfo.id,
						start_time:this.moment().format('YYYY-MM-DD HH:mm:ss'),
						current_time:curr_time,
						play_time:play_time,
						index_code:this.itemData.index_code,
					}
					if(this.videoData.log_id){
						comData.log_id=this.videoData.log_id
					}
					this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/updateCurrentTime',comData,response=>{
						console.log("responsea: " + JSON.stringify(response));
						if(response.log_id){
							this.videoData.log_id=response.log_id
						}
					})
				}
			}
			this.clearIntervals()
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
