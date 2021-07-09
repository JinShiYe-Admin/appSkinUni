<template>
	<view class="">
		<mynavBar :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<template v-if="show">
			<uni-title class="h4" style="align-items: center;padding: 3px 0;" type="h4" title="暂无考试安排"></uni-title>
		</template>
		<template v-else>
			<view class="tabs">
				<view class="example-body">
					<uni-notice-bar :show-icon="true" text="考试安排：本学期考试安排如下，请同学们按时参加考试。" />
				</view>
				<uni-row class="demo-uni-row">
						<uni-col class="card-list" :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-for="item in pageData">
						   <uni-card-examination mode="style" :is-shadow="true" :thumbnail="item.img_url?item.img_url:'http://jbsch-pb.zhuxue101.net/develop/hr/student/2vsr68c0jn_1616635382610.png'" class="u-card">
								<uni-tag v-if="item.test_status==2" text="未开始" size="small" type="warning" class="tag-right"/>
								<uni-tag v-else-if="item.test_status==0 && item.answer_number && item.answer_number !== 0" :text="`已提交: ${item.answer_number}/${item.question_count}`" size="small" type="error" class="tag-right"/>
								<uni-tag v-else-if="item.test_status==0 && item.answer_number && item.answer_number === 0" text="考试中" size="small" type="error" class="tag-right"/>
								<uni-tag v-else-if="item.test_status==3" text="已评" size="small" type="primary" class="tag-right"/>
								<uni-tag v-else-if="item.test_status==4 || item.test_status==5" text="考试结束" size="small" type="primary" class="tag-right"/>
								
								<view ><text class="text">{{ item.test_name }}</text></view>
								<view style="margin-top: 10px;color: #4f4f4f;"><text class="text-mini">满分：{{parseInt(item.score)}} 分</text></view>
								<view style="margin-top: 5px; color: #4f4f4f;"><text class="text-mini">学期：{{item.grd_name}}{{item.term_name}}</text></view>
								<view style="margin-top: 5px; color: #4f4f4f;"><text class="text-mini">时间：{{item.start_time.substring(0, 16)}} - {{item.end_time.substring(0, 16)}}</text></view>
								<view style="margin-top: 5px; color: #4f4f4f;">
									<uni-col :span="12"><text class="text-mini">时长：{{item.duration}} 天</text></uni-col>
									<uni-col :span="12" style="text-align: right;" v-if="item.test_status==0"><button class="mini-btn mini-btn-design" type="primary" size="mini" @click="toDetail(item)" >答题</button></uni-col>
								</view> 
						   </uni-card-examination> 
						</uni-col>
				</uni-row>  
				<uni-load-more :status="status" :icon-size="17" :content-text="contentText" />
			</view>
		</template>
		<u-tabbar :list="tabbar" ></u-tabbar>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	import mynavBar from '../../components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
				loadFlag:0,//0 刷新 1加载更多
				
				
				index_code:'',
				pageData:[],//页面列表数据
				
				show:false,
				page_number:1,//页码
				status:'more',//加载更多的状态
				contentText: {
					contentdown: '',//上滑加载更多
					contentrefresh: '加载中',
					contentnomore: ''//没有更多
				},
				canload:true,//是否加载更多
				
				
				tabbar: []
			}
		},
		components: {
			mynavBar
		},
		methods: {
			getList() {
			   let comData={
			   	stu_code:this.personInfo.user_code,
				page_number:this.page_number,
				page_size: 12,
			   	index_code:this.index_code,
			   }
			   this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/exam/page',comData,response=>{
				   console.log("response: " + JSON.stringify(response));
				   response.list.map(item=>{
					   const days=this.moment(item.end_time).diff(this.moment(item.start_time),'day')
					   item.duration=days
				   })
					if(this.loadFlag===0){
						this.pageData=[].concat(response.list)
					}else{
						this.pageData=this.pageData.concat(response.list)
					}
					if(this.pageData.length===0){
						this.show=true
					}
					if(this.page_number>=response.total_page){
						this.status = 'noMore';
						this.canload=false
					}else{
						this.status = 'more';
					}
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
			   })
			},
			toDetail(item){
				let that =this
				item.index_code=this.index_code
				util.openwithData('./detail',item,{
					refreshPage(data){
						this.loadFlag=0
						that.showLoading()
						that.canload=true
						that.page_number=1
						that.getList()
					}
				})
			}
		},
		onLoad:function(){
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			let tempMenu;
			if (util.getMenuMore().length==0) {
				tempMenu = util.getTabbarMenu();
			} else{
				tempMenu = util.getPageData(option);
			}
			this.tabBarItem = tempMenu;
			this.index_code=tempMenu.access.split("#")[1]
			this.getList()
		},
		onReachBottom() {
			if(this.canload){
				this.loadFlag=1
				this.status = 'loading';
				this.page_number=this.page_number+1
				this.getList()
			}
		},
		onPullDownRefresh() {
			this.loadFlag=0
			this.showLoading()
			this.canload=true
			this.page_number=1
			this.getList()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		}
	}
</script>

<style>
   /* #ifndef APP-PLUS */
    /* page {
        width: 100%;
        min-height: 100%;
        display: flex;
    } */

    /* #endif */
    .tabs {
		 
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        background-color: #FFFFFF;
    }
	  
	 .text {
	 	font-size: 24rpx;
	 	margin-top: 10rpx;
		word-break: break-all;
	 }
	 
	 .text-mini{
		 font-size: 20rpx;
		 word-break: break-all;
	 }
	 
	 .u-card{
		 margin: 4px 7px;
	 }
	 
	 .tag-right{
	 	position: absolute;
	 	left: 0;
	 	margin-top: -12px;
	 	font-size: 12px;
	 	height: 22px;
	 }
	 
	 .mini-btn-design{
		 margin:0px -5px 0 0;
		 padding: 0 1.1em;
		 position: absolute;
		 right: 10px;
		 bottom: 3px;
		 background-color:#00CFBD !important;
	 }
	 .card-list{
		 /* #ifdef APP-PLUS */
		  margin-top: -15px;
		  /* #endif */
	 }
</style>
