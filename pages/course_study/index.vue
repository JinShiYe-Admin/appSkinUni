<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs">
			<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
				<view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap">
					<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
				</view>
			</scroll-view>
			<view class="line-h"></view>
			<uni-row class="demo-uni-row">
			    <uni-col class="card-list" :xs="12" :sm="12" :md="6" :lg="4" :xl="4" v-for="item in dataList">
			       <uni-card-study mode="style" :is-shadow="true" :thumbnail="item.book_img_url" @click="toDetail(item)" class="u-card">
						<text class="text">{{ item.sub_name }}</text>
			       </uni-card-study>
			    </uni-col> 
			</uni-row> 
		</view> 
		<u-tabbar-my :list="tabbar" ></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js'
	import mynavBar from '../../components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
						
				index_code:'',
				dataList: [],
				cacheTab: [],
				tabIndex: 0,
				tabBars: [],
				scrollInto: "",
			}
		},
		components: {
			mynavBar
		},
		methods: {
			ontabtap(e) {
			    let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.showLoading();
				this.getList(index,this.tabBars[index].id)
				this.tabIndex=index
			},
			getTabList(){//获取tab栏列表 2.1学期列表
				let comData={
					stu_code:this.personInfo.user_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/termList',comData,response=>{
					console.log("response: " + JSON.stringify(response));
						if(response.list&&response.list.length>0){
							response.list.map(item=>{
								item.name=item.grd_name+item.term_name
								item.id=item.sys_grd_code+'_'+item.term_code
							})
							this.tabBars=response.list
							this.getList(0,response.list[0].id)
						}else{
							setTimeout(function () {
								uni.stopPullDownRefresh();
							}, 1000);
							this.showToast("暂无学期")
							this.hideLoading()
						}
				})
			},
			getList(index,id) {//2.2课程列表
			   let comData={
			    sys_grd_code:id.split("_")[0],
			    term_code:id.split("_")[1],
			   	stu_code:this.personInfo.user_code,
			   	index_code:this.index_code,
			   }
			   this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/list',comData,response=>{
				   setTimeout(function () {
				   	uni.stopPullDownRefresh();
				   }, 1000);
					this.dataList=response.list
				    this.hideLoading()
			   })
			},
			toDetail(item){
				let tabData=this.tabBars[this.tabIndex]
				console.log("tabData: " + JSON.stringify(tabData));
				item.term_name=tabData.name
				item.index_code=this.index_code
				util.openwithData('./detail',item,{
					callParent:data=>{
						console.log("data: " + JSON.stringify(data));
					}
				})
			}
		},
		onLoad:function(){
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
			setTimeout(()=>{
				this.showLoading();
				this.getTabList();
			},350)
		},
		onPullDownRefresh() {
			this.showLoading()
			this.getList(this.tabIndex,this.tabBars[this.tabIndex].id)
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		}
	}
</script>

<style>
   /* #ifndef APP-PLUS */
  /*  page {
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

    .scroll-h {
        width: 750rpx;
		width:100%;
		height: 80rpx;
		background-color: #FFFFFF;
        flex-direction: row;
        white-space: nowrap;
     
    }

    .line-h {
        height: 1rpx;
        background-color: #cccccc;
    }

    .uni-tab-item {
        display: inline-block;
        flex-wrap: nowrap;
        padding-left: 34rpx;
        padding-right: 34rpx;
    }

    .uni-tab-item-title {
        color: #555;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        flex-wrap: nowrap;
        white-space: nowrap;
    }

    .uni-tab-item-title-active {
        color: #00CFBD;
    }
 
	 
	 .example {
	 	padding: 0 15px 15px;
	 }
	 
	 .example-info {
	 	padding: 15px;
	 	color: #3b4144;
	 	background: #ffffff;
	 }
	 
	 .text {
	 	font-size: 26rpx;
	 	margin-top: 10rpx;
	 }
	 
	 .grid-dynamic-box {
	 	margin-bottom: 15px;
	 }
	 
	 .grid-item-box {
	 	flex: 1;
	 	/* #ifndef APP-NVUE */
	 	display: flex;
	 	/* #endif */
	 	flex-direction: column;
	 	align-items: center;
	 	justify-content: center;
	 	padding: 15px 0;
	 }
	 
	 .grid-dot {
	 	position: absolute;
	 	top: 5px;
	 	right: 15px;
	 }
	 
	 .u-card{
		 margin: 4px 4px;
	 }
	 
	 .card-list{
	 		 /* #ifdef APP-PLUS */
	 		  margin-top: -10px;
	 		  /* #endif */
	 }
</style>
