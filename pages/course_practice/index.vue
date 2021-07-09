<template>
	<view>
		<mynavBar :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs">
			<picker class="flex-box" @change="termClick" :value="tremIndex" :range="tremArray" range-key="name">
				<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled :value="tremArray[tremIndex].name" ></uni-easyinput>
			</picker>
			<picker class="flex-box" @change="courseClick" :value="subIndex" :range="subArray" range-key="sub_name">
				<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled :value="subArray[subIndex].sub_name" ></uni-easyinput>
			</picker>
			<picker class="flex-box" @change="statusClick" :value="statusIndex" :range="statusArray" range-key="name">
				<uni-easyinput suffixIcon="arrowdown" :styles="styles" disabled :value="statusArray[statusIndex].name" ></uni-easyinput>
			</picker>
		</view>
		<view class="content-body">
			<template v-for="item in pageData">
				<uni-card  isShadow><!--  @click="clickCard" -->
					<uni-tag v-if="item.stu_test_status==2" text="已做" size="small" type="warning" class="tag-right"/>
					<uni-tag v-else-if="item.stu_test_status==1" text="未做" size="small" type="error" class="tag-right"/>
					<uni-tag v-else-if="item.stu_test_status==3" text="已评" size="small" type="primary" class="tag-right"/>
					 
					<uni-row>
						<uni-col :span="20"><uni-title class="h4" type="h4" :title="item.test_name"></uni-title></uni-col>
					</uni-row>
					<uni-row style="margin-top: 5px;">
						<uni-col :span="10" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><text style="font-size: 22rpx;">学期: {{item.grd_name}}{{item.term_name}}</text></uni-col>
						<uni-col :span="10"  style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><text style="font-size: 22rpx;">课程: {{item.sub_name}}</text></uni-col>
						<uni-col :span="4"  style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;text-align: right;"><text style="font-size: 22rpx;">满分: {{parseInt(item.score)}}</text></uni-col>
					</uni-row>
					<uni-row>
						<uni-col :span="24">
							<text style="font-size: 22rpx;margin-top: 8px;">时间: {{item.start_time.split(' ')[0]}} ~ {{item.end_time.split(' ')[0]}}</text>
						</uni-col>
					</uni-row>
					<uni-row style="margin-top: 10px;">
						<uni-col :span="24" style="text-align: right;">
							 <button v-if="item.stu_test_status!=1" class="mini-btn" type="default" size="mini" style="margin-left: 5px;font-size: 12px;padding: 0 1em;"  @click="clickLook(item)">查看</button>
							 <button v-if="item.stu_test_status!=3" class="mini-btn" type="primary" size="mini" style="margin-left: 5px;font-size: 12px;padding: 0 1em;background-color: #00CFBD;"  @click="clickTest(item)">答题</button>
						</uni-col>
					</uni-row>
				</uni-card>
			</template> 
		</view>
		<uni-load-more :status="status" :icon-size="17" :content-text="contentText" />
		<u-tabbar :list="tabbar" ></u-tabbar>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	import mynavBar from '../../components/my-navBar/m-navBar';
	const personal =util.getPersonal();
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
				
				
				
				index_code:'',
				queryData:{},//查询栏得到的数据
				pageData:[],//页面列表数据
				
				page_number:1,//页码
				
				//picker数据
				tremIndex:0,
				subIndex:0,
				statusIndex:0,
				tremArray: [{name:'全部',value:''}],
				subArray: [{sub_name:'全部',sub_code:''}],
				statusArray: [{name:'全部',value:''},{name:'未做',value:1},{name:'已做',value:2},{name:'已评',value:3}],

				status:'more',//加载更多的状态
				contentText: {
					contentdown: '',//上滑加载更多
					contentrefresh: '加载中',
					contentnomore: ''//没有更多
				},
				canload:true,//是否加载更多
				loadFlag:0,//0 刷新 1加载更多
				
				tabbar: [],
				styles: {borderColor:'rgba(204,198,204,0.4)',borderRadius: '10px',margin: '0 1px 0'}
			}
		},
		components: {
			mynavBar
		},
		methods: {
			termClick:function(e){
				if(this.tremIndex!==e.detail.value){
					this.tremIndex=e.detail.value
					if(e.detail.value-1>=0){
						let term=this.queryData.list[(e.detail.value-1)]
						this.subArray=[{sub_name:'全部',sub_code:''}].concat(term.sub_list)
					}
					this.showLoading()
					this.loadFlag=0
					this.canload=true
					this.page_number=1
					this.getPageList()
				}
			},
			courseClick:function(e){
				if(this.subIndex!==e.detail.value){
					this.subIndex=e.detail.value
					this.showLoading()
					this.loadFlag=0
					this.canload=true
					this.page_number=1
					this.getPageList()
				}
			},
			statusClick:function(e){
				if(this.statusIndex!==e.detail.value){
					this.statusIndex=e.detail.value
					this.showLoading()
					this.loadFlag=0
					this.canload=true
					this.page_number=1
					this.getPageList()
				}
			},
			getTermList(){
				let comData={
					stu_code:personal.user_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/work/query',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					this.queryData=response
					if(response.list&&response.list.length>0){
						response.list.map(item=>{
							item.name=item.grd_name+item.term_name
							item.value=item.term_code
						})
						this.tremArray=[{name:'全部',value:''}].concat(response.list)
					}else{
						this.showToast('暂无学期')
					}
				})
			},
			getPageList(){
				let comData={
					page_number: this.page_number,
					page_size: 15,
					stu_code:personal.user_code,
					stu_test_status: this.statusArray[this.statusIndex].value,
					sub_code: this.subArray[this.subIndex].sub_code?this.subArray[this.subIndex].sub_code:'',
					sys_grd_code: this.tremArray[this.tremIndex].sys_grd_code?this.tremArray[this.tremIndex].sys_grd_code:'',
					term_code: this.tremArray[this.tremIndex].term_code?this.tremArray[this.tremIndex].term_code:'',
					stu_code:personal.user_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/work/page',comData,response=>{
					console.log("response: " + JSON.stringify(response));
					if(this.loadFlag===0){
						this.pageData=[].concat(response.list)
					}else{
						this.pageData=this.pageData.concat(response.list)
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
			clickLook(item){
				item.index_code=this.index_code
				util.openwithData('./detail-show',item)
			},
			clickTest(item){
				let that=this
				item.index_code=this.index_code
				util.openwithData('./detail-practice',item,{
					refresh(data){
						this.loadFlag=0
						that.showLoading()
						that.canload=true
						that.page_number=1
						that.getPageList()
					}
				})
			}
		},
		onLoad() {
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
			this.showLoading()
			this.getTermList()
			this.getPageList()
		},
		onReachBottom() {
			if(this.canload){
				this.loadFlag=1
				this.status = 'loading';
				this.page_number=this.page_number+1
				this.getPageList()
			}
		},
		onPullDownRefresh() {
			this.loadFlag=0
			this.showLoading()
			this.canload=true
			this.page_number=1
			this.getPageList()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		}
	}
</script>

<style>
	/* page {
	    width: 100%;
	    min-height: 100%;
	    display: flex;
		flex-direction: column;
		background-color: #EEF0F2;
	} */
	.tabs {
		top: 44px; 
	    display: flex;
	    flex-direction: row;
	    overflow: hidden;
	    background-color: #FFFFFF;
		padding: 3px;
		z-index: 10;
	}
	.flex-box{
		 flex: 1;
	}
	.tag-right{
		position: absolute;
		right: 10px;
		margin-top: 6px;
		font-size: 12px;
		height: 22px;
	}
</style>
