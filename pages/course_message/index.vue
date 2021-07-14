<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#00cfbd" @clickItem="onClickItem" />
		</view>
		<view class="content">
			<view v-if="current === 0">
				<uni-card-message title="通知公告"  :note="pagedata0.notice.create_time?pagedata0.notice.create_time:''" isShadow @click="clickCard(pagedata0.notice,0)"><text class="content-box-text">{{pagedata0.notice.name?pagedata0.notice.name:'暂无内容'}} <text v-show="pagedata0.notice.name" class="detail-c" >详情</text></text></uni-card-message>
				<uni-card-message title="考试"     :note="pagedata0.exam.create_time?pagedata0.exam.create_time:''"  isShadow><text class="content-box-text">{{pagedata0.exam.name?`【${pagedata0.exam.name}】 已经布置，请及时完成`:'暂无内容'}}</text></uni-card-message>
				<uni-card-message title="作业"     :note="pagedata0.work.create_time?pagedata0.work.create_time:''"  isShadow><text class="content-box-text">{{pagedata0.work.name?`【${pagedata0.work.name}】 已经布置，请及时完成`:'暂无内容'}}</text></uni-card-message>
			</view> 
			<view v-if="current === 1">
				<uni-easyinput suffixIcon="search" style="padding:10px 15px 2px;width: auto;" v-model="pageobj1.keyword" placeholder='请输入 "标题" 关键字' @iconClick="iconClick"></uni-easyinput>
				<uni-card-message v-for="item in pagedata1" :note="item.create_time" isShadow @click="clickCard(item,1)"><text class="content-box-text">{{item.title}} <text class="detail-c" >详情</text></text></uni-card-message>
				<uni-load-more :status="pageobj1.status" :icon-size="17" :content-text="pageobj1.contentText" />
			</view>
			<view v-if="current === 2">
				<uni-card-message v-for="item in pagedata2" :note="item.create_time?item.create_time:''" isShadow><text class="content-box-text">【{{item.test_name}}】 已经布置，请及时完成</text></uni-card-message>
				<uni-load-more :status="pageobj2.status" :icon-size="17" :content-text="pageobj2.contentText" /><!-- title="系统通知"  -->
			</view>
		</view>
		
		<u-tabbar-my :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				items: ['最新消息', '通知公告', '系统推送'],
				current: 0,
				index_code:'',
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
				pageobj1:{
					keyword:'',
					loadFlag:0,//0 刷新 1加载更多
					page_number:1,//页码
					status:'more',//加载更多的状态
					contentText: {
						contentdown: '',//上滑加载更多
						contentrefresh: '加载中',
						contentnomore: ''//没有更多
					},
					canload:true,//是否加载更多
				},
				pageobj2:{
					loadFlag:0,//0 刷新 1加载更多
					page_number:1,//页码
					status:'more',//加载更多的状态
					contentText: {
						contentdown: '',//上滑加载更多
						contentrefresh: '加载中',
						contentnomore: ''//没有更多
					},
					canload:true,//是否加载更多
				},
				pagedata0:{
					exam:{create_time:'',name:''},
					work:{create_time:'',name:''},
					notice:{create_time:'',name:''},
				},
				pagedata1:[],
				pagedata2:[],
			}
		},
		components: {
			mynavBar
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
				if(this.current===0){
					if(this.pagedata0.per_major_list){}else{
						this.showLoading()
						this.getList0()
					}
				}else if(this.current===1){
					if(this.pagedata1.length===0){
						this.showLoading()
						this.pageobj1.loadFlag=0
						this.pageobj1.canload=true
						this.pageobj1.page_number=1
						this.getList1()
					}
				}else if(this.current===2){
					if(this.pagedata2.length===0){
						this.showLoading()
						this.pageobj2.loadFlag=0
						this.pageobj2.canload=true
						this.pageobj2.page_number=1
						this.getList2()
					}
				}
			},
			getList0(){
				let comData={
					stu_code:this.personInfo.user_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/index',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.pagedata0=response
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
				})
			},
			getList1(){
				let comData={
					keyword: this.pageobj1.keyword,
					page_number: this.pageobj1.page_number,
					page_size: 20,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'notice/page',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if(this.pageobj1.loadFlag===0){
						this.pagedata1=[].concat(response.list)
					}else{
						this.pagedata1=this.pagedata1.concat(response.list)
					}
					if(this.pageobj1.page_number>=response.total_page){
						this.pageobj1.status = 'noMore';
						this.pageobj1.canload=false
					}else{
						this.pageobj1.status = 'more';
					}
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
				})
			},
			getList2(){
				let comData={
					page_number: this.pageobj2.page_number,
					page_size: 20,
					stu_code:this.personInfo.user_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/center/noticePage',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if(this.pageobj2.loadFlag===0){
						this.pagedata2=[].concat(response.list)
					}else{
						this.pagedata2=this.pagedata2.concat(response.list)
					}
					if(this.pageobj2.page_number>=response.total_page){
						this.pageobj2.status = 'noMore';
						this.pageobj2.canload=false
					}else{
						this.pageobj2.status = 'more';
					}
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
				})
			},
			clickCard(item,tag){
				console.log(item);
				if(this.pagedata0.notice.name){
					if(tag===0){
						item.title=item.name
					}
					item.index_code=this.index_code
					util.openwithData('./notice_detail',item)
				}
			},
			iconClick(){
				this.pageobj1.loadFlag=0
				this.pageobj1.canload=true
				this.pageobj1.page_number=1
				this.getList1()
			}
		},
		onLoad(option) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			})
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			if(util.getTabbarMenu().url){
				this.tabBarItem = util.getTabbarMenu();
				util.setTabbarMenu({});
			}else{
				this.tabBarItem = util.getPageData(option);
			}
			this.index_code=this.tabBarItem.access.split("#")[1]
			this.showLoading()
			this.getList0()
		},
		onPullDownRefresh() {
			if(this.current===0){
				this.getList0()
			}else if(this.current===1){
				this.pageobj1.loadFlag=0
				this.pageobj1.canload=true
				this.pageobj1.page_number=1
				this.getList1()
			}else if(this.current===2){
				this.pageobj2.loadFlag=0
				this.pageobj2.canload=true
				this.pageobj2.page_number=1
				this.getList2()
			}
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.current===1){
				if(this.pageobj1.canload){
					this.pageobj1.loadFlag=1
					this.pageobj1.status = 'loading';
					this.pageobj1.page_number=this.pageobj1.page_number+1
					this.getList1()
				}
			}else if(this.current===2){
				if(this.pageobj2.canload){
					this.pageobj2.loadFlag=1
					this.pageobj2.status = 'loading';
					this.pageobj2.page_number=this.pageobj2.page_number+1
					this.getList2()
				}
			}
		},
	}
</script>

<style>
	.content-box-text {
		font-size: 13px;
		line-height: 22px;
		word-break: break-all;
	}
	.detail-c{
		display: flex;
		margin-top: -10px;
		color: #00CFBD;
		justify-content: flex-end;
	}
</style>
